import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { useGetPrasadById } from '@/api/PrasadQueries';
import { useAddToCart, useGetCart, useUpdateCartItem } from '@/api/CartQueries';
import toast from 'react-hot-toast';
import { isAuthenticated, saveRedirectDestination } from '@/lib/authRedirect';
import { useNavigate } from 'react-router-dom';
import Bestseller from './Bestseller';
import ImportantParshad from './ImportantParshad';
import BuyNowCheckoutModal from './BuyNowCheckoutModal';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

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
    const { t, lang } = useI18n();
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

    // Handle itemsIncluded properly - check if it exists and has items (API may return array of objects)
    const currentWhatsInBox = displayData?.itemsIncluded && displayData.itemsIncluded.length > 0
        ? displayData.itemsIncluded.map((it: any) => (typeof it === 'string' ? it : it.itemName ?? it.itemDescription)).join(', ')
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

    const isProcessing = updateCartMutation.isPending || addToCartMutation.isPending;

    const updateQuantity = (newQuantity: number) => {
        if (isProcessing) return;

        // Validation
        if (newQuantity < 1) {
            if (isInCart && cartItemId) {
                // If in cart and going below 1, remove it
                updateCartMutation.mutate(
                    {
                        itemId: cartItemId,
                        data: {
                            action: 'remove',
                            quantity: cartQuantity || 1,
                        }
                    },
                    {
                        onSuccess: () => {
                            setQuantity(1);
                            toast.success(t('prashad.section.removedFromCart') || 'Removed from cart', { position: 'top-center' });
                            // If we are in "Buy Now" mode, close the modal
                            if (isBuyNowOpen) setIsBuyNowOpen(false);
                        },
                        onError: (error) => {
                            console.error('Error removing from cart:', error);
                            toast.error(t('prashad.section.failedUpdate'), { position: 'top-center' });
                        }
                    }
                );
            } else {
                // If in Buy Now modal and not in cart, just close the modal
                if (isBuyNowOpen) {
                    setIsBuyNowOpen(false);
                    return;
                }
                toast.error(t('prashad.section.minQuantity'), { position: 'top-center' });
            }
            return;
        }

        if (newQuantity > currentStock) {
            toast.error(t('prashad.section.onlyAvailable').replace('{{count}}', String(currentStock)), { position: 'top-center' });
            return;
        }

        // Calculate delta for API
        const delta = newQuantity - quantity;
        if (delta === 0) return;

        setQuantity(newQuantity);

        // If product is already in cart, update it via API
        if (isInCart && cartItemId) {
            const action = delta > 0 ? 'add' : 'remove';
            const quantityChange = Math.abs(delta);

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
                        setQuantity(quantity); // Revert to old quantity
                        toast.error(t('prashad.section.failedUpdate'), { position: 'top-center' });
                    }
                }
            );
        }
    };

    const handleQuantityChange = (change: number) => {
        updateQuantity(quantity + change);
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
                        toast.success(t('prashad.detail.addedToCart') || 'Added to cart successfully', { position: 'top-center' });
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
                        toast.error(t('prashad.section.failedAdd'), { position: 'top-center' });
                    },
                }
            );
        }
    };


    // Note: Buy Now flow removed to match provided UI (Add to cart + Go to Cart only)

    // Generate gallery images or use placeholder
    // Note: galleryImages is now defined above, so we don't redefine it here
    // console.log(currentName, currentDescription)
    // return <></>
    return (
        <>
            <div className="w-full pt-28 lg:pt-0">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:min-h-[550px]">
                        {/* Left Side - Images */}
                        <div className="p-6 lg:p-8 flex flex-col">


                            {/* Main Image */}
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-5 shadow-sm w-full aspect-square flex items-center justify-center relative p-4">
                                {galleryImages[selectedImage] ? (
                                    <LazyLoadImage
                                        src={galleryImages[selectedImage]}
                                        alt={currentName?.[lang]}
                                        className="w-full h-full object-contain"
                                        wrapperClassName="w-full h-full flex items-center justify-center"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
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
                                                    alt={`${currentName?.[lang]} ${index + 1}`}
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
                            {/* Loading Overlay */}
                            <AnimatePresence>
                                {isProcessing && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-[1px] rounded-lg"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-[#8b0000] animate-spin" />
                                            <span className="text-sm font-medium text-[#8b0000]">{t('prashad.section.updating')}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Title */}
                            <h2 className="font-primaryFont text-3xl lg:text-4xl text-gray-900 mb-5 tracking-tight">
                                {currentName?.[lang]}
                            </h2>

                            {/* Stock Information */}
                            {displayData?.stock !== undefined && (
                                <div className="mb-4">
                                    <p className="font-secondaryFont text-sm text-gray-600">
                                        {displayData.stock > 0 ? (
                                            <>
                                                <span className="text-green-600 font-semibold">{t('prashad.detail.inStock')}</span>
                                                <span className="ml-2">({displayData.stock} {lang === "en"
                                                    ? displayData.stock > 0 ? "Available" : "Not Available"
                                                    : lang === "hi"
                                                        ? displayData.stock > 0 ? "उपलब्ध" : "उपलब्ध नहीं"
                                                        : displayData.stock > 0 ? "ઉપલબ્ધ" : "ઉપલબ્ધ નથી"})</span>
                                            </>
                                        ) : (
                                            <span className="text-red-600 font-semibold">{t('prashad.detail.outOfStock')}</span>
                                        )}
                                    </p>
                                </div>
                            )}

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                                <div className="text-4xl font-bold text-[#8b0000] tracking-tight">
                                    ₹{currentPrice}
                                </div>
                                {isInCart && (
                                    <div className="flex items-center gap-0 border-2 border-[#8b0000] rounded-lg overflow-hidden relative">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={isProcessing}
                                            title={quantity <= 1 ? 'Remove from cart' : 'Decrease quantity'}
                                            aria-label={quantity <= 1 ? 'Remove from cart' : 'Decrease quantity'}
                                            className="p-3 transition-colors hover:bg-[#8b0000] hover:text-white"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>

                                        <div className="w-px bg-[#8b0000] h-8" />

                                        <div className="font-secondaryFont text-xl font-bold min-w-[50px] text-center text-gray-900 px-4 overflow-hidden h-8 flex items-center justify-center relative">
                                            <AnimatePresence mode="popLayout" initial={false}>
                                                <motion.span
                                                    key={quantity}
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -20, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="block"
                                                >
                                                    {quantity}
                                                </motion.span>
                                            </AnimatePresence>
                                        </div>

                                        <div className="w-px bg-[#8b0000] h-8" />

                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= currentStock || isProcessing}
                                            title="Increase quantity"
                                            aria-label="Increase quantity"
                                            className={`p-3 transition-colors ${quantity >= currentStock
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'hover:bg-[#8b0000] hover:text-white'
                                                }`}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="font-secondaryFont text-xl font-bold text-gray-900 mb-3">
                                    {t('prashad.detail.descriptionTitle')}
                                </h3>
                                <p className="font-secondaryFont text-sm text-gray-500 leading-relaxed">
                                    {currentDescription?.[lang]}
                                </p>
                            </div>

                            {/* What's in the box */}
                            <div className="mb-8 flex-grow">
                                <h3 className="font-secondaryFont text-xl font-bold text-gray-900 mb-3">
                                    {t('prashad.detail.whatsInBoxTitle')}
                                </h3>
                                {displayData?.itemsIncluded && displayData.itemsIncluded.length > 0 ? (
                                    <ul className="font-secondaryFont text-sm text-gray-500 leading-relaxed list-disc list-inside space-y-1">
                                        {displayData.itemsIncluded.map((item: any, index: number) => (
                                            <li key={item._id ?? index}>{typeof item === 'string' ? item : (item.itemName ?? item.itemDescription ?? '')}</li>
                                        ))}
                                    </ul>
                                ) : currentWhatsInBox ? (
                                    <p className="font-secondaryFont text-sm text-gray-500 leading-relaxed">
                                        {currentWhatsInBox}
                                    </p>
                                ) : (
                                    <p className="font-secondaryFont text-sm text-gray-400 leading-relaxed italic">
                                        {t('prashad.detail.noItemsInfo')}
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
                                            {t('prashad.detail.adding')}
                                        </>
                                    ) : displayData?.stock === 0 ? (
                                        t('prashad.detail.outOfStock')
                                    ) : isInCart ? (
                                        t('prashad.section.goToCheckout')
                                    ) : (
                                        t('prashad.detail.addToCart')
                                    )}
                                </button>

                                {isInCart && (
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={displayData?.stock === 0 || displayData?.isAvailable === false}
                                        className="w-full font-secondaryFont py-3 rounded-xl text-base font-semibold border-2 border-[#8b0000] text-[#8b0000] bg-white hover:bg-[#fff5f5] transition-colors"
                                    >
                                        {t('prashad.detail.buyNow')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <BuyNowCheckoutModal
                isOpen={isBuyNowOpen}
                onClose={() => setIsBuyNowOpen(false)}
                prasadId={prasadId}
                prasadName={currentName?.[lang]}
                prasadPrice={currentPrice}
                quantity={quantity}
                prasadImage={galleryImages[selectedImage]}
                onQuantityChange={(newQty: number) => setQuantity(newQty)}
                isUpdating={isProcessing}
            />
        </>
    );
};

export default PrashadDetailCard;
