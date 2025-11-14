import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import lineImage from "@/assets/images/line.png";
import PrashadDetailModal from './PrashadDetailModal';
import { useGetPrasad } from '@/api/PrasadQueries';
import { useAddToCart, useGetCart, useUpdateCartItem } from '@/api/CartQueries';
import { saveRedirectDestination, isAuthenticated } from '@/lib/authRedirect';

export interface PrashadPlan {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
    whatsInBox?: string;
    gallery?: string[];
    category?: string;
    _id?: string;
}

interface PrashadSectionProps {
    title: string;
    description?: string;
    plans?: PrashadPlan[];
    className?: string;
    useApiData?: boolean; // Flag to determine if API data should be used
    categoryFilter?: string; // Category to filter by
}

const PrashadSection: React.FC<PrashadSectionProps> = ({
    title,
    description,
    plans: propPlans,
    className = "",
    useApiData = true, // Default to using API data
    categoryFilter // Category filter
}) => {

    const [selectedPlan, setSelectedPlan] = useState<PrashadPlan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch data from API
    const { data: apiData, isLoading, isError } = useGetPrasad();

    // Fetch cart data
    const { data: cartData } = useGetCart();

    // Determine which plans to use (memoized to avoid identity changes each render)
    const plans: PrashadPlan[] = useMemo(() => {
        let computed: PrashadPlan[] = useApiData && apiData?.data
            ? apiData.data.map((item: any) => {
                const primaryImage = item?.featuredImage || (Array.isArray(item?.images) && item.images.length > 0 ? item.images[0] : item?.image);
                return {
                    _id: item._id,
                    id: item.id || (item._id ? parseInt(item._id) : undefined),
                    name: item.name,
                    price: item.price,
                    image: primaryImage,
                    description: item.description,
                    whatsInBox: item.itemsIncluded ? item.itemsIncluded.join(', ') : item.whatsInBox,
                    gallery: item.images || item.gallery,
                    category: item.category
                } as PrashadPlan;
            })
            : (propPlans || []);

        // Apply category filter if provided (for API data only)
        if (categoryFilter && useApiData) {
            computed = computed.filter(plan => {
                if (!plan.category) return false;
                const normalizedCategory = plan.category.toLowerCase().trim();
                const normalizedFilter = categoryFilter.toLowerCase().trim();
                return normalizedCategory === normalizedFilter;
            });
        }
        return computed;
        // Dependencies: recompute only when data or filters change
    }, [useApiData, apiData?.data, propPlans, categoryFilter]);

    // Cart mutation hooks
    const addToCartMutation = useAddToCart();
    const updateCartMutation = useUpdateCartItem();

    // Helper function to get cart item for a prasad
    const getCartItemForPrasad = (prasadId: string) => {
        const cartDataResponse = cartData?.data as any;
        const cartItems = cartDataResponse?.cart?.items || cartDataResponse?.items || [];
        return cartItems.find((item: any) => item.prasad._id === prasadId);
    };

    // Handler for quantity change in cart items
    const handleQuantityChangeInCard = (plan: PrashadPlan, change: number) => {
        const prasadId = plan._id || String(plan.id || '');
        const cartItem = getCartItemForPrasad(prasadId);

        if (!cartItem) return;

        const currentQuantity = cartItem.quantity;
        const newQuantity = currentQuantity + change;

        // Prevent going below 1
        if (newQuantity < 1) {
            toast.error('Minimum quantity is 1. To remove from cart, use the cart page.');
            return;
        }

        // Check stock limits if available
        const stock = (apiData?.data?.find((item: any) => item._id === prasadId) as any)?.stock || 999;
        if (newQuantity > stock) {
            toast.error(`Only ${stock} items available in stock`);
            return;
        }

        // Update cart via API
        const action = change > 0 ? 'add' : 'remove';
        const quantityChange = Math.abs(change);

        updateCartMutation.mutate(
            {
                itemId: cartItem._id,
                data: {
                    action: action,
                    quantity: quantityChange,
                }
            },
            {
                onError: (error) => {
                    console.error('Error updating cart:', error);
                    toast.error('Failed to update cart. Please try again.');
                }
            }
        );
    };

    // Handler for the small "Add to Cart" button inside the card (does not open modal)
    const handleAddToCartButton = (plan: PrashadPlan) => {
        const prasadId = plan._id || String(plan.id || '');
        if (!prasadId) {
            toast.error('Unable to add item to cart');
            return;
        }

        // If not authenticated, save redirect intent and go to login immediately
        if (!isAuthenticated()) {
            try {
                saveRedirectDestination(window.location.pathname, { openPrasadDetail: true, prasadId });
            } catch (e) { }
            navigate('/login');
            return;
        }

        addToCartMutation.mutate(
            { prasad: prasadId, quantity: 1, amount: Number(plan.price || 0), skipToast: true } as any,
            {
                onSuccess: () => {
                    try { window?.dispatchEvent(new CustomEvent('cart:added', { detail: { prasadId } })); } catch (e) { }
                    toast.success(`${plan.name} added to cart`, { position: 'top-center' });
                },
                onError: (err: any) => {
                    const status = err?.response?.status;
                    if (status === 401) {
                        // Save rich redirect intent so after login we can re-open the prasad modal
                        saveRedirectDestination(window.location.pathname, { openPrasadDetail: true, prasadId });
                        navigate('/login');
                        return;
                    }
                    toast.error('Failed to add to cart. Please try again.');
                }
            }
        );
    };

    // If navigation brought us here with an intent to open a specific prasad detail, handle it.
    const location = useLocation();
    useEffect(() => {
        try {
            const navState = (location.state as any) || {};
            // Example: { openPrasadDetail: true, prasadId: '...' }
            if (navState.openPrasadDetail && navState.prasadId) {
                // Try to find matching plan and open modal
                const found = plans.find(p => (p._id || String(p.id || '')) === String(navState.prasadId));
                if (found) {
                    setSelectedPlan(found);
                    setIsModalOpen(true);
                    // Clear navigation state via router to prevent repeated opens ONLY after success
                    try {
                        navigate(location.pathname + location.search, { replace: true });
                    } catch (e) { }
                }
            }
        } catch (e) {
            // ignore
        }
        // only run once on mount or when plans change
    }, [location.state, plans, navigate, location.pathname, location.search]);

    // Open modal for a plan (image click) — does NOT add to cart
    const handleOpenModal = (plan: PrashadPlan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedPlan(null), 300);
    };

    // Handle loading state
    if (useApiData && isLoading) {
        return (
            <section className={`w-full bg-white py-8 md:py-12 ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="font-primaryFont text-[28px] sm:text-[36px] lg:text-[42px] text-[#8b0000] mb-3">
                            {title}
                        </h2>
                    </div>
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b0000]"></div>
                    </div>
                </div>
            </section>
        );
    }

    // Handle error state
    if (useApiData && isError) {
        return (
            <section className={`w-full bg-white py-8 md:py-12 ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="font-primaryFont text-[28px] sm:text-[36px] lg:text-[42px] text-[#8b0000] mb-3">
                            {title}
                        </h2>
                    </div>
                    <div className="text-center py-12">
                        <p className="text-gray-600 font-secondaryFont">Failed to load prasad items. Please try again later.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (

        <div className={`w-full bg-white py-8 md:py-12 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h2 className="font-primaryFont text-[28px] sm:text-[36px] lg:text-[42px] text-[#8b0000] mb-3">
                        {title}
                    </h2>

                    {/* Decorative Line */}
                    <div className="relative mb-4 mt-3 flex justify-center">
                        <div className="relative w-full max-w-md h-2">
                            <LazyLoadImage
                                className="w-full h-2 object-cover"
                                alt="Decorative Line"
                                src={lineImage}
                                loading="lazy"
                            />
                            <div className="absolute w-3 h-3 top-0 left-1/2 transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                            <div className="absolute w-2 h-2 top-0.5 left-[calc(50%+12px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                            <div className="absolute w-2 h-2 top-0.5 left-[calc(50%-12px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                            <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%+24px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                            <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%-24px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                            <div className="absolute w-3 h-3 top-0 left-0 bg-secondaryColor rounded-full" />
                            <div className="absolute w-3 h-3 top-0 right-0 bg-secondaryColor rounded-full" />
                        </div>
                    </div>

                    {description && (
                        <p className="font-secondaryFont text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
                            {description}
                        </p>
                    )}
                </div>

                {/* Prashad Plans Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {plans.map((plan) => {
                        const prasadId = plan._id || String(plan.id || '');
                        const cartItem = getCartItemForPrasad(prasadId);
                        const isInCart = !!cartItem;
                        const cartQuantity = cartItem?.quantity || 0;

                        return (
                            <div
                                key={plan.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:scale-105 cursor-pointer"
                                onClick={() => handleOpenModal(plan)}
                            >
                                <div className="aspect-square bg-gray-200 relative">
                                    {plan.image ? (
                                        <LazyLoadImage
                                            src={plan.image}
                                            alt={plan.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-secondaryFont text-base sm:text-lg text-gray-700 mb-1">
                                        {plan.name}
                                    </h3>
                                    <p className="font-secondaryFont text-xl sm:text-2xl  text-[#8b0000] font-semibold">
                                        ₹{plan.price}
                                    </p>
                                    <div className="mt-3">
                                        {isInCart ? (
                                            // Show quantity controls when item is in cart
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-center gap-0 border-2 border-[#8b0000] rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleQuantityChangeInCard(plan, -1); }}
                                                        disabled={cartQuantity <= 1}
                                                        className={`p-2 transition-colors border-r-2 border-[#8b0000] ${cartQuantity <= 1
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'hover:bg-[#8b0000] hover:text-white'
                                                            }`}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-secondaryFont text-base font-bold min-w-[40px] text-center text-gray-900 px-3">
                                                        {cartQuantity}
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleQuantityChangeInCard(plan, 1); }}
                                                        className="p-2 transition-colors border-l-2 border-[#8b0000] hover:bg-[#8b0000] hover:text-white"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Show Add to Cart button when item is not in cart
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAddToCartButton(plan); }}
                                                className="w-full flex items-center justify-center gap-2 border border-[#8b0000] text-[#8b0000] py-2 px-3 rounded-lg mt-2 hover:bg-[#8b0000] hover:text-white transition-colors"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M6 6h15l-1.5 9h-11z" />
                                                    <circle cx="9" cy="20" r="1" />
                                                    <circle cx="19" cy="20" r="1" />
                                                </svg>
                                                <span className="font-medium">Add to Cart</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            <PrashadDetailModal
                plan={selectedPlan}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>


    );
};

export default PrashadSection;
