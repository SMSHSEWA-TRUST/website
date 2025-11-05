import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Minus, Plus } from 'lucide-react';
// CartModal replaced by full-page checkout navigation
import { useBuyNow } from '@/api/BuyNowQueries';
import { useGetPrasadById } from '@/api/PrasadQueries';
import { useAddToCart, useVerifyPayment } from '@/api/CartQueries';
import { useGetPrasadCharge } from '@/api/ChargeQueries';
import toast from 'react-hot-toast';
import { isAuthenticated, saveRedirectDestination } from '@/lib/authRedirect';
import { useNavigate } from 'react-router-dom';

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
    isOpen: boolean;
    onClose: () => void;
}

const PrashadDetailModal: React.FC<PrashadDetailModalProps> = ({ plan, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    // Full page checkout; no modal state needed
    const navigate = useNavigate();

    // Fetch detailed prasad data when modal opens
    const prasadId = plan?._id || String(plan?.id || '');
    const { data: prasadDetails, isLoading, isError } = useGetPrasadById(prasadId, isOpen && !!prasadId);

    // Add to cart mutation
    const addToCartMutation = useAddToCart();
    // Buy Now mutation - keep hooks together and before any early return
    const buyNowMutation = useBuyNow();
    // Verify payment mutation from cart queries (reused for buy-now verification)
    const verifyPaymentMutation = useVerifyPayment();
    const [isBuyNowCheckoutOpen, setIsBuyNowCheckoutOpen] = useState(false);

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

    // Reset selected image when modal opens or data changes
    useEffect(() => {
        if (isOpen) {
            setSelectedImage(0);
            setQuantity(1);
        }
    }, [isOpen, prasadId]);

    // Robust body scroll lock: fix body position to prevent background scrolling and avoid layout shift.
    useEffect(() => {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        const body = document.body;
        const docEl = document.documentElement;

        // Save originals to restore later
        const originalBodyOverflow = body.style.overflow;
        const originalBodyPosition = body.style.position;
        const originalBodyTop = body.style.top;
        const originalBodyPaddingRight = body.style.paddingRight;

        let savedScrollY = 0;

        if (isOpen) {
            // Save current scroll
            savedScrollY = window.scrollY || window.pageYOffset;

            // Calculate scrollbar width and set padding-right to avoid layout shift
            const scrollBarWidth = window.innerWidth - docEl.clientWidth;
            if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

            // Lock body in place
            body.style.position = 'fixed';
            body.style.top = `-${savedScrollY}px`;
            body.style.left = '0';
            body.style.right = '0';
            body.style.overflow = 'hidden';
        }

        return () => {
            // Restore body styles
            body.style.overflow = originalBodyOverflow;
            body.style.position = originalBodyPosition;
            body.style.top = originalBodyTop;
            body.style.paddingRight = originalBodyPaddingRight;

            // Restore scroll position
            if (isOpen) {
                const scrollY = Math.abs(Number(body.style.top || '0')) || savedScrollY;
                window.scrollTo(0, scrollY);
            }
        };
    }, [isOpen]);

    if (!isOpen || !plan) return null;

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= currentStock) {
            setQuantity(newQuantity);
        } else if (newQuantity > currentStock) {
            // Optional: Show alert when trying to exceed stock
            alert(`Only ${currentStock} items available in stock`);
        }
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
                    onClose();
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
                    alert('Failed to add item to cart. Please try again.');
                },
            }
        );
    };


    // Open a dedicated checkout modal which fetches charges and then proceeds to payment
    const handleBuyNow = () => {
        // If not authenticated, save redirect intent and go to login immediately
        if (!isAuthenticated()) {
            try {
                saveRedirectDestination(window.location.pathname, { openPrasadDetail: true, prasadId });
            } catch (e) { }
            window.location.href = '/login';
            return;
        }
        setIsBuyNowCheckoutOpen(true);
    };

    // Close Buy Now checkout and optionally close main modal
    const handleCloseBuyNow = (alsoCloseParent = false) => {
        setIsBuyNowCheckoutOpen(false);
        if (alsoCloseParent) onClose();
    };

    // Buy Now Checkout Modal - fetches charge info and initiates server order + Razorpay
    const BuyNowCheckoutModal: React.FC = () => {
        const { data: chargesApiResp, isLoading: isLoadingCharges } = useGetPrasadCharge(prasadId, isBuyNowCheckoutOpen && !!prasadId);
        const [isProcessingPayment, setIsProcessingPayment] = useState(false);

        const chargeItem = (chargesApiResp && chargesApiResp.data && Array.isArray(chargesApiResp.data) && chargesApiResp.data[0]) || null;
        const deliveryCharges = chargeItem ? Number(chargeItem.deliveryCharges || 0) : 0;
        const serviceFee = chargeItem ? Number(chargeItem.serviceFee || 0) : 0;
        const taxes = chargeItem ? Number(chargeItem.taxes || 0) : 0;

        const subtotal = currentPrice * quantity;
        const totalRupees = Math.round(subtotal + deliveryCharges + serviceFee + taxes);

        const proceedToPayment = async () => {
            // Reuse existing buyNow mutation to create server order for buy-now
            if (!prasadId) return;
            setIsProcessingPayment(true);
            try {
                // amount sent to server should be in rupees (send total including charges)
                const amountRupees = totalRupees;
                const serverOrder: any = await buyNowMutation.mutateAsync({ prasadId, amount: amountRupees });

                // Build options for Razorpay similar to cart flow
                const loadRazorpayScript = () => new Promise<boolean>((resolve) => {
                    if ((window as any).Razorpay) return resolve(true);
                    const existing = document.querySelector('script[data-razorpay]');
                    if (existing) {
                        setTimeout(() => resolve(!!(window as any).Razorpay), 500);
                        return;
                    }
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.async = true;
                    script.setAttribute('data-razorpay', 'true');
                    script.onload = () => resolve(!!(window as any).Razorpay);
                    script.onerror = () => resolve(false);
                    document.head.appendChild(script);
                });

                const loaded = await loadRazorpayScript();
                if (!loaded) throw new Error('Razorpay script failed to load');

                // normalize server response: look for nested order or direct fields
                const srv = serverOrder && (serverOrder.order || serverOrder.data || serverOrder);

                const options: any = {
                    key: (import.meta as any).env?.VITE_RAZORPAY_KEY || '',
                    amount: (srv && (srv.amount || srv.amount_paid)) || Math.round(currentPrice * quantity) * 100,
                    currency: (srv && srv.currency) || 'INR',
                    name: 'SM SHSEWA TRUST',
                    description: `Prasad - ${currentName}`,
                    prefill: {
                        name: (localStorage.getItem('name') || '') as string,
                        email: (localStorage.getItem('email') || '') as string,
                        contact: (localStorage.getItem('phone') || '') as string,
                    },
                    theme: { color: '#8B0000' },
                    modal: { ondismiss: () => { setIsProcessingPayment(false); } },
                };

                // attach order id from server if available
                if (srv && (srv.id || srv.order_id)) {
                    options.order_id = srv.id || srv.order_id;
                } else {
                    const returnedId = serverOrder && (serverOrder.id || serverOrder.order_id);
                    if (returnedId) options.order_id = returnedId;
                }

                // Payment success handler - verify on backend using same verify endpoint
                options.handler = async (response: any) => {
                    try {
                        const verifyPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };
                        const verifyResp = await verifyPaymentMutation.mutateAsync(verifyPayload as any);
                        if (verifyResp && (verifyResp as any).success) {
                            toast.success('Payment verified successfully!');
                            handleCloseBuyNow(true);
                        } else {
                            console.warn('Payment verification response:', verifyResp);
                            toast.error('Payment completed but verification failed. Please contact support.');
                        }
                    } catch (err) {
                        console.error('Verification call failed', err);
                        toast.error('Payment completed but verification failed. Please contact support.');
                    }
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            } catch (err: any) {
                // if unauthorized, preserve intent and redirect to login similar to other flows
                const status = (err as any)?.response?.status;
                if (status === 401) {
                    localStorage.setItem('auth_redirect_destination', JSON.stringify({
                        path: window.location.pathname,
                        state: { openPrasadDetail: true, prasadId }
                    }));
                    window.location.href = '/login';
                    return;
                }
                console.error('Buy Now / Payment error', err);
                toast.error('Failed to initiate payment. Please try again.');
            } finally {
                setIsProcessingPayment(false);
            }
        };

        if (!isBuyNowCheckoutOpen) return null;

        return (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={() => handleCloseBuyNow()} />
                <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full z-10 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold">Checkout</h3>
                        <button onClick={() => handleCloseBuyNow()} aria-label="Close">✕</button>
                    </div>

                    <div className="space-y-4 mb-4">
                        <div>
                            <div className="text-sm text-gray-600">Item</div>
                            <div className="text-lg font-semibold">{currentName}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">Quantity</div>
                            <div className="text-lg font-semibold">{quantity}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">Price</div>
                            <div className="text-lg font-semibold">₹{currentPrice}</div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-600">Charges</div>
                            {isLoadingCharges ? (
                                <div className="text-sm text-gray-500">Loading charges...</div>
                            ) : chargeItem ? (
                                <div className="text-sm text-gray-700 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Delivery Charges</span>
                                        <span>₹{deliveryCharges.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Service Fee</span>
                                        <span>₹{serviceFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Taxes</span>
                                        <span>₹{taxes.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-semibold">₹{totalRupees.toFixed(2)}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">No extra charges</div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={proceedToPayment}
                            disabled={isProcessingPayment}
                            className="flex-1 bg-[#8b0000] text-white py-3 rounded-lg font-semibold disabled:opacity-60"
                        >
                            {isProcessingPayment ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                        <button onClick={() => handleCloseBuyNow()} className="px-4 py-3 rounded-lg border">Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    // removed checkout modal handlers

    // Generate gallery images or use placeholder
    // Note: galleryImages is now defined above, so we don't redefine it here

    return (
        <div className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-3xl shadow-2xl w-full max-w-4xl sm:my-8 my-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b0000]"></div>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-lg z-10">
                        Failed to load details. Showing cached data.
                    </div>
                )}

                {/* Scrollable Content */}
                <div className="overflow-hidden rounded-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:min-h-[600px]">
                        {/* Left Side - Images */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 lg:p-10 flex flex-col">
                            {/* Back Button */}
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 text-gray-700 mb-6 hover:text-[#8b0000] transition-colors group"
                            >
                                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="font-secondaryFont text-base font-medium">Plan Details</span>
                            </button>

                            {/* Main Image */}
                            <div className="bg-gray-200 rounded-2xl overflow-hidden mb-5 shadow-md flex-1 flex items-center justify-center">
                                {galleryImages[selectedImage] ? (
                                    <LazyLoadImage
                                        src={galleryImages[selectedImage]}
                                        alt={currentName}
                                        className="w-full h-full object-cover max-h-[350px]"
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
                                <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide pl-2 pr-2">
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
                                                    className="w-20 h-20 object-cover sm:w-24 sm:h-24 md:w-28 md:h-28 "
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

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <button
                                    onClick={handleBuyNow}
                                    className="font-secondaryFont py-4 px-6 rounded-xl border-2 border-[#8b0000] text-[#8b0000] text-base font-semibold hover:bg-[#8b0000] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                    disabled={displayData?.stock === 0 || displayData?.isAvailable === false || buyNowMutation.isPending}
                                >
                                    {buyNowMutation.isPending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8b0000]"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        'Buy Now'
                                    )}
                                </button>
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
                                    ) : (
                                        'Add to cart'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {/* Buy Now Checkout Modal (opened when user clicks Buy Now) */}
            {isBuyNowCheckoutOpen && <BuyNowCheckoutModal />}

            {/* Cart checkout modal removed - using /checkout route */}
        </div>
    );
};

export default PrashadDetailModal;
