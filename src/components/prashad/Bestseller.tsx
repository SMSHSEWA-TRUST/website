import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ShoppingCart, Minus, Plus, Loader2 } from 'lucide-react';
import { useGetPrasadByTag } from '@/api/PrasadQueries';
import { useAddToCart, useGetCart, useUpdateCartItem } from '@/api/CartQueries';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useI18n } from '@/lib/i18n';
import { isAuthenticated } from '@/lib/authRedirect';
import { motion, AnimatePresence } from 'framer-motion';

const Bestseller: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useI18n();
    const { data: prasadData, isLoading } = useGetPrasadByTag('Bestsellers');
    const addToCartMutation = useAddToCart();
    const { data: cartData } = useGetCart();
    const updateCartMutation = useUpdateCartItem();
    const [addingId, setAddingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Get first 5 prasad items for bestsellers
    const bestsellers = prasadData?.data?.slice(0, 5) || [];

    const getCartItemForPrasad = (prasadId: string) => {
        const cartDataResponse = cartData?.data as any;
        const cartItems = cartDataResponse?.cart?.items || cartDataResponse?.items || [];
        return cartItems.find((item: any) => item.prasad._id === prasadId);
    };

    const handleQuantityChangeInCard = (prasad: any, change: number) => {
        const prasadId = prasad._id;
        const cartItem = getCartItemForPrasad(prasadId);
        if (!cartItem) return;

        // Set updating state
        setUpdatingId(prasadId);

        const currentQuantity = cartItem.quantity;
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
            // Treat decrement below 1 as remove action: remove entire cart item
            updateCartMutation.mutate({ itemId: cartItem._id, data: { action: 'remove', quantity: currentQuantity } }, {
                onSuccess: () => {
                    toast.success(`${prasad.name} removed from cart`);
                    setUpdatingId(null);
                },
                onError: (err) => {
                    console.error('Error removing cart item:', err);
                    toast.error('Failed to update cart. Please try again.');
                    setUpdatingId(null);
                }
            });
            return;
        }

        const action = change > 0 ? 'add' : 'remove';
        const quantityChange = Math.abs(change);

        updateCartMutation.mutate({ itemId: cartItem._id, data: { action: action as any, quantity: quantityChange } }, {
            onSuccess: () => {
                setUpdatingId(null);
            },
            onError: (err) => {
                console.error('Error updating cart:', err);
                setUpdatingId(null);
            }
        });
    };

    const handleAddToCart = (prasad: any) => {
        if (!isAuthenticated()) {
            window.location.href = '/login';
            return;
        }

        const amount = prasad.price * 1;
        setAddingId(prasad._id);
        addToCartMutation.mutate(
            {
                prasad: prasad._id,
                quantity: 1,
                amount: amount,
            },
            {
                onSuccess: () => {
                    toast.success(`${prasad.name} ${t('prashad.section.addedToCartSuffix')}`, { position: 'top-center' });
                },
                onError: (error) => {
                    console.error('Error adding to cart:', error);
                    const status = (error as any)?.response?.status;
                    if (status === 401) {
                        window.location.href = '/login';
                        return;
                    }
                    toast.error(t('prashad.section.failedAdd'), { position: 'top-center' });
                },
                onSettled: () => {
                    setAddingId(null);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="w-full py-12">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                    <div className="flex gap-4 overflow-x-auto">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-gray-200 rounded-lg w-52 h-64"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!bestsellers || bestsellers.length === 0) {
        return null;
    }

    return (
        <div className="w-full py-12 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <div className="text-center mb-4">
                    <h2 className="text-3xl md:text-4xl font-primaryFont text-[#8b0000] inline-block border-b-[4px] border-[#D05E2D] pb-2">
                        {t('prashad.bestseller.heading')}
                    </h2>
                </div>

                {/* Bestseller Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {bestsellers.map((prasad, index) => (
                        <div
                            key={prasad._id || index}
                            className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col relative"
                        >
                            {/* Loading Overlay */}
                            <AnimatePresence>
                                {(updatingId === prasad._id || addingId === prasad._id) && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-[1px]"
                                    >
                                        <Loader2 className="w-8 h-8 text-[#8b0000] animate-spin" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Image */}
                            <div
                                className="w-full aspect-square bg-gray-100 cursor-pointer overflow-hidden"
                                onClick={() => navigate(`/prashad/${prasad._id}`)}
                            >
                                {prasad.featuredImage || prasad.image || prasad.images?.[0] ? (
                                    <LazyLoadImage
                                        src={prasad.featuredImage || prasad.image || prasad.images?.[0]}
                                        alt={prasad.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-3 md:p-4 flex flex-col flex-grow">
                                {/* Name */}
                                <h3
                                    className="font-secondaryFont text-sm md:text-base text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-[#8b0000] transition-colors"
                                    onClick={() => navigate(`/prashad/${prasad._id}`)}
                                >
                                    {prasad.name}
                                </h3>

                                {/* Price */}
                                <p className="font-secondaryFont text-lg md:text-xl font-bold text-[#8b0000] mb-3">
                                    ₹{prasad.price}
                                </p>

                                {/* Add to Cart or Quantity Controls */}
                                {(() => {
                                    const cartItem = getCartItemForPrasad(prasad._id);
                                    const isInCart = !!cartItem;
                                    const cartQuantity = cartItem?.quantity || 0;

                                    if (isInCart) {
                                        return (
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-center gap-0 border-2 border-[#8b0000] rounded-lg overflow-hidden relative">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleQuantityChangeInCard(prasad, -1); }}
                                                        // Allow decrement at 1 so user can remove item from cart
                                                        disabled={updatingId === prasad._id}
                                                        title={cartQuantity <= 1 ? 'Remove from cart' : 'Decrease quantity'}
                                                        aria-label={cartQuantity <= 1 ? 'Remove from cart' : 'Decrease quantity'}
                                                        className={`p-3 transition-colors ${cartQuantity <= 1
                                                            ? 'hover:bg-red-600 hover:text-white'
                                                            : 'hover:bg-[#8b0000] hover:text-white'
                                                            }`}
                                                    >
                                                        <Minus className="w-5 h-5" />
                                                    </button>

                                                    {/* Visual divider to show clickable area */}
                                                    <div className="w-px bg-[#8b0000] h-8" />

                                                    <div className="font-secondaryFont text-xl font-bold min-w-[50px] text-center text-gray-900 px-4 overflow-hidden h-8 flex items-center justify-center relative">
                                                        <AnimatePresence mode="popLayout" initial={false}>
                                                            <motion.span
                                                                key={cartQuantity}
                                                                initial={{ y: 20, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                exit={{ y: -20, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="block"
                                                            >
                                                                {cartQuantity}
                                                            </motion.span>
                                                        </AnimatePresence>
                                                    </div>

                                                    <div className="w-px bg-[#8b0000] h-8" />

                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleQuantityChangeInCard(prasad, 1); }}
                                                        title="Increase quantity"
                                                        aria-label="Increase quantity"
                                                        disabled={updatingId === prasad._id || cartQuantity >= (prasad.stock ?? 999)}
                                                        className={`p-3 transition-colors ${cartQuantity >= (prasad.stock ?? 999) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-[#8b0000] hover:text-white'}`}
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAddToCart(prasad); }}
                                            disabled={addingId === prasad._id || prasad.stock === 0 || prasad.isAvailable === false}
                                            className={`w-full font-secondaryFont py-2 px-3 rounded-md text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-auto ${addingId === prasad._id || prasad.stock === 0 || prasad.isAvailable === false
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-white text-[#8b0000] border-2 border-[#8b0000] hover:bg-[#8b0000] hover:text-white'
                                                }`}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            {prasad.stock === 0 || prasad.isAvailable === false ? t('prashad.section.outOfStock') : addingId === prasad._id ? t('prashad.section.adding') : t('prashad.section.addToCart')}
                                        </button>
                                    );
                                })()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bestseller;
