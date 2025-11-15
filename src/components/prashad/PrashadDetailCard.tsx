import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Minus, Plus } from 'lucide-react';
import { useGetPrasadById } from '@/api/PrasadQueries';
import { useAddToCart, useGetCart, useUpdateCartItem } from '@/api/CartQueries';
import toast from 'react-hot-toast';
import { isAuthenticated, saveRedirectDestination } from '@/lib/authRedirect';
import { useNavigate } from 'react-router-dom';
import Bestseller from './Bestseller';
import ImportantParshad from './ImportantParshad';
import BuyNowCheckoutModal from './BuyNowCheckoutModal';

interface PrashadPlan {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
    whatsInBox?: string;
    gallery?: string[];
    _id?: string;
}

interface PrashadDetailModalProps {
    plan: PrashadPlan | null;
    // `isOpen` is optional so this component can be used both as a modal and a page
    isOpen?: boolean;
    // `onClose` is optional; when not provided the component will navigate back
    onClose?: () => void;
}

const PrashadDetailCard: React.FC<PrashadDetailModalProps> = ({ plan, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    // Full page checkout; no modal state needed
    const navigate = useNavigate();

    // Fetch detailed prasad data when modal opens or page mounts
    const prasadId = plan?._id || String(plan?.id || '');
    const { data: prasadDetails } = useGetPrasadById(prasadId, !!prasadId);

    // Fetch cart data to check if product is already in cart
    const { data: cartData } = useGetCart();

    // Add to cart mutation
    const addToCartMutation = useAddToCart();
    const updateCartMutation = useUpdateCartItem();

    // Find if current prasad is already in cart
    const cartDataResponse = cartData?.data as any;
    const cartItems = cartDataResponse?.cart?.items || cartDataResponse?.items || [];
    const cartItem = cartItems.find(
        (item: any) => item.prasad._id === prasadId
    );
    const isInCart = !!cartItem;
    const cartItemId = cartItem?._id;
    const cartQuantity = cartItem?.quantity || 0;

    // Use API data if available, otherwise fall back to plan prop
    const displayData = prasadDetails?.data;

    // Process images from API response
    const currentName = displayData?.name || plan?.name || '';
    const currentPrice = displayData?.price || plan?.price || 0;
    const currentDescription = displayData?.description || plan?.description || '';

    // Handle images: featuredImage as main image, images array for gallery
    const apiImages = displayData?.images || [];
    const featuredImage = displayData?.featuredImage;
    const galleryImages = featuredImage ? [featuredImage, ...apiImages] : apiImages.length > 0 ? apiImages : (displayData?.image ? [displayData.image] : plan?.gallery || (plan?.image ? [plan.image] : []));

    const currentStock = displayData?.stock || 999; // Default to high number if stock not available

    // Handle itemsIncluded properly - check if it exists and has items
    const currentWhatsInBox = displayData?.itemsIncluded && displayData.itemsIncluded.length > 0
        ? displayData.itemsIncluded.join(', ')
        : displayData?.whatsInBox || plan?.whatsInBox || '';

    // Reset selected image when modal opens (modal usage) or when page/prasad changes
    useEffect(() => {
        // Treat undefined `isOpen` (page usage) as open
        if (isOpen === undefined || isOpen) {
            setSelectedImage(0);
            // If product is in cart, set quantity to cart quantity, otherwise 1
            setQuantity(cartQuantity > 0 ? cartQuantity : 1);
        }
    }, [isOpen, prasadId, cartQuantity]);

    // This component is now page-style (not a modal). No body-lock or backdrop behavior.

    if (!plan) return null;

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= currentStock) {
            setQuantity(newQuantity);

            // If product is already in cart, update it via API
            if (isInCart && cartItemId) {
                // Determine action based on change direction
                const action = change > 0 ? 'add' : 'remove';
                const quantityChange = Math.abs(change);

                updateCartMutation.mutate(
                    {
                        itemId: cartItemId,
                        data: {
                            action: action,
                            quantity: quantityChange,
                        }
                    },
                    {
                        onError: (error) => {
                            console.error('Error updating cart:', error);
                            // Revert quantity on error
                            setQuantity(quantity);
                            toast.error('Failed to update cart. Please try again.', { position: 'top-center' });
                        }
                    }
                );
            }
        } else if (newQuantity > currentStock) {
            // Optional: Show alert when trying to exceed stock
            toast.error(`Only ${currentStock} items available in stock`, { position: 'top-center' });
        } else if (newQuantity < 1 && isInCart) {
            // If trying to go below 1 and item is in cart, user might want to remove it
            // For now, we keep minimum at 1
            toast.error('Minimum quantity is 1. To remove from cart, use the cart page.', { position: 'top-center' });
        }
    };

    const handleBuyNow = () => {
        // If not authenticated, save redirect intent and go to login immediately
        if (!isAuthenticated()) {
            try {
                saveRedirectDestination(window.location.pathname, { openPrasadDetail: true, prasadId, intent: 'buy_now' });
            } catch (e) { }
            window.location.href = '/login';
            return;
        }

        // Open the Buy Now checkout modal
        setIsBuyNowOpen(true);
    };
    const handleAddToCart = () => {
        // If not authenticated, save redirect intent and go to login immediately
        if (!isAuthenticated()) {
            try {
                saveRedirectDestination(window.location.pathname, { openPrasadDetail: true, prasadId });
            } catch (e) { }
            window.location.href = '/login';
            return;
        }

        if (isInCart) {
            // Product is already in cart - navigate to checkout page
            navigate('/checkout');
            if (onClose) onClose();
        } else {
            // Product not in cart - add it
            // Calculate total amount
            const amount = currentPrice * quantity;

            // Call API to add to cart
            addToCartMutation.mutate(
                {
                    prasad: prasadId,
                    quantity: quantity,
                    amount: amount,
                },
                {
                    onSuccess: (data) => {
                        console.log('Added to cart successfully:', data);
                        // Navigate to full-page checkout
                        navigate('/checkout');
                        // Optionally close detail modal
                        if (onClose) onClose();
                    },
                    onError: (error) => {
                        console.error('Error adding to cart:', error);
                        const status = (error as any)?.response?.status;
                        if (status === 401) {
                            // Save rich redirect intent so after login we can re-open the prasad modal
                            localStorage.setItem('auth_redirect_destination', JSON.stringify({
                                path: window.location.pathname,
                                state: { openPrasadDetail: true, prasadId }
                            }));
                            window.location.href = '/login';
                            return;
                        }
                        toast.error('Failed to add item to cart. Please try again.', { position: 'top-center' });
                    },
                }
            );
        }
    };


    // Note: Buy Now flow removed to match provided UI (Add to cart + Go to Cart only)

    // Generate gallery images or use placeholder
    // Note: galleryImages is now defined above, so we don't redefine it here

    return (
        <>
            <div className="w-full">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:min-h-[550px]">
                        {/* Left Side - Images */}
                        <div className="p-6 lg:p-8 flex flex-col">


                            {/* Main Image */}
                            <div className="bg-gray-200 rounded-2xl overflow-hidden mb-5 shadow-md flex-1 flex items-center justify-center">
                                {galleryImages[selectedImage] ? (
                                    <LazyLoadImage
                                        src={galleryImages[selectedImage]}
                                        alt={currentName}
                                        className="w-full h-full object-cover max-h-[520px]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-100 to-gray-200">
                                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Gallery Thumbnails - horizontal, scrollable like e-commerce */}
                            <div className="mt-4 w-full">
                                <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide pl-2 pr-2 items-center">
                                    {galleryImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            aria-current={selectedImage === index}
                                            className={`shadow-sm transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedImage === index ? 'ring-2 ring-[#8b0000] ' : ''}`}
                                            style={{ minWidth: 88 }}
                                        >
                                            {img ? (
                                                <LazyLoadImage
                                                    src={img}
                                                    alt={`${currentName} ${index + 1}`}
                                                    className="w-20 h-20 object-cover sm:w-24 sm:h-24 md:w-28 md:h-28"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-100 to-gray-200">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Details */}
                        <div className="bg-white p-8 lg:p-10 flex flex-col relative">
                            {/* Title */}
                            <h2 className="font-primaryFont text-3xl lg:text-4xl text-gray-900 mb-5 tracking-tight">
                                {currentName}
                            </h2>

                            {/* Stock Information */}
                            {displayData?.stock !== undefined && (
                                <div className="mb-4">
                                    <p className="font-secondaryFont text-sm text-gray-600">
                                        {displayData.stock > 0 ? (
                                            <>
                                                <span className="text-green-600 font-semibold">In Stock</span>
                                                <span className="ml-2">({displayData.stock} available)</span>
                                            </>
                                        ) : (
                                            <span className="text-red-600 font-semibold">Out of Stock</span>
                                        )}
                                    </p>
                                </div>
                            )}

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                                <div className="text-4xl font-bold text-[#8b0000] tracking-tight">
                                    ₹{currentPrice}
                                </div>
                                <div className="flex items-center gap-0 border-2 border-[#8b0000] rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className={`p-3 transition-colors border-r-2 border-[#8b0000] ${quantity <= 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'hover:bg-[#8b0000] hover:text-white'
                                            }`}
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="font-secondaryFont text-xl font-bold min-w-[50px] text-center text-gray-900 px-4">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= currentStock}
                                        className={`p-3 transition-colors border-l-2 border-[#8b0000] ${quantity >= currentStock
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'hover:bg-[#8b0000] hover:text-white'
                                            }`}
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="font-secondaryFont text-xl font-bold text-gray-900 mb-3">
                                    Description
                                </h3>
                                <p className="font-secondaryFont text-sm text-gray-500 leading-relaxed">
                                    {currentDescription || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                                </p>
                            </div>

                            {/* What's in the box */}
                            <div className="mb-8 flex-grow">
                                <h3 className="font-secondaryFont text-xl font-bold text-gray-900 mb-3">
                                    What's in the box
                                </h3>
                                {displayData?.itemsIncluded && displayData.itemsIncluded.length > 0 ? (
                                    <ul className="font-secondaryFont text-sm text-gray-500 leading-relaxed list-disc list-inside space-y-1">
                                        {displayData.itemsIncluded.map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                ) : currentWhatsInBox ? (
                                    <p className="font-secondaryFont text-sm text-gray-500 leading-relaxed">
                                        {currentWhatsInBox}
                                    </p>
                                ) : (
                                    <p className="font-secondaryFont text-sm text-gray-400 leading-relaxed italic">
                                        No items information available
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons (match provided image): primary full-width Add to cart, outlined Go to Cart below */}
                            <div className="flex flex-col gap-3 mt-auto">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={displayData?.stock === 0 || displayData?.isAvailable === false || addToCartMutation.isPending}
                                    className={`font-secondaryFont py-4 px-6 rounded-xl text-base font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${displayData?.stock === 0 || displayData?.isAvailable === false || addToCartMutation.isPending
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-[#8b0000] text-white hover:bg-[#660000] hover:shadow-lg'
                                        }`}
                                >
                                    {addToCartMutation.isPending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Adding...
                                        </>
                                    ) : displayData?.stock === 0 ? (
                                        'Out of Stock'
                                    ) : isInCart ? (
                                        'Go to Checkout'
                                    ) : (
                                        'Add to cart'
                                    )}
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={displayData?.stock === 0 || displayData?.isAvailable === false}
                                    className="w-full font-secondaryFont py-3 rounded-xl text-base font-semibold border-2 border-[#8b0000] text-[#8b0000] bg-white hover:bg-[#fff5f5] transition-colors"
                                >
                                    Buy now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <BuyNowCheckoutModal
                isOpen={isBuyNowOpen}
                onClose={() => setIsBuyNowOpen(false)}
                prasadId={prasadId}
                prasadName={currentName}
                prasadPrice={currentPrice}
                quantity={quantity}
                prasadImage={galleryImages[selectedImage]}
                onQuantityChange={(newQty: number) => setQuantity(newQty)}
            />
        </>
    );
};

export default PrashadDetailCard;
