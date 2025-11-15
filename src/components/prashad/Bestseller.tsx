import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useGetPrasad } from '@/api/PrasadQueries';
import { useAddToCart, useGetCart, useUpdateCartItem } from '@/api/CartQueries';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { isAuthenticated } from '@/lib/authRedirect';

const Bestseller: React.FC = () => {
    const navigate = useNavigate();
    const { data: prasadData, isLoading } = useGetPrasad();
    const addToCartMutation = useAddToCart();
    const { data: cartData } = useGetCart();
    const updateCartMutation = useUpdateCartItem();
    const [addingId, setAddingId] = useState<string | null>(null);

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

        const currentQuantity = cartItem.quantity;
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
            // Minimum qty is 1; user should remove from cart via cart page
            return;
        }

        const action = change > 0 ? 'add' : 'remove';
        const quantityChange = Math.abs(change);

        updateCartMutation.mutate({ itemId: cartItem._id, data: { action: action as any, quantity: quantityChange } }, {
            onError: (err) => {
                console.error('Error updating cart:', err);
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
                    toast.success('Added to cart successfully!', { position: 'top-center' });
                },
                onError: (error) => {
                    console.error('Error adding to cart:', error);
                    const status = (error as any)?.response?.status;
                    if (status === 401) {
                        window.location.href = '/login';
                        return;
                    }
                    toast.error('Failed to add item to cart. Please try again.', { position: 'top-center' });
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
                        Our other Bestsellers
                    </h2>
                </div>

                {/* Bestseller Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {bestsellers.map((prasad, index) => (
                        <div
                            key={prasad._id || index}
                            className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                        >
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
                                                <div className="flex items-center justify-center gap-0 border-2 border-[#8b0000] rounded-md overflow-hidden">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleQuantityChangeInCard(prasad, -1); }}
                                                        disabled={cartQuantity <= 1}
                                                        className={`p-2 transition-colors border-r-2 border-[#8b0000] ${cartQuantity <= 1
                                                            ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                                            : 'hover:bg-[#8b0000] hover:text-white'
                                                            }`}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-secondaryFont text-base font-bold min-w-[40px] text-center text-gray-900 px-3">
                                                        {cartQuantity}
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleQuantityChangeInCard(prasad, 1); }}
                                                        className="p-2 transition-colors border-l-2 border-[#8b0000] hover:bg-[#8b0000] hover:text-white"
                                                    >
                                                        <Plus className="w-4 h-4" />
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
                                            {prasad.stock === 0 || prasad.isAvailable === false ? 'Out of Stock' : addingId === prasad._id ? 'Adding...' : 'Add to Cart'}
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
