import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Minus, Plus, Edit } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Layout } from '@/layout/Layout';
import { useGetCart, useUpdateCartItem, useCreateOrder, useVerifyPayment } from '@/api/CartQueries';
import { useGetUserAddresses, useSetPreferredAddress, useAddUserAddress, useUpdateUserAddress, useDeleteUserAddress } from '@/api/ProfileQueries';
import { AddressFormModal, AddressSelectionModal, AddressModel as AddressModelType } from '@/components/address';

interface PrasadData {
    _id: string;
    name: string;
    description: string;
    images: string[];
    featuredImage?: string;
    price: number;
    stock: number;
    itemsIncluded: string[];
    category: string;
    isAvailable: boolean;
}

interface CartItemData {
    _id: string;
    prasad: PrasadData;
    quantity: number;
    amount: number;
}

// Use AddressModel from address components
type AddressModel = AddressModelType;

const CartItemDisplay: React.FC<{
    cartItem: CartItemData;
    onQuantityChange: (id: string, change: number) => void;
    onRemove: (id: string, quantity: number) => void;
    isUpdating?: boolean;
}> = ({ cartItem, onQuantityChange, onRemove, isUpdating = false }) => {
    const prasad = cartItem.prasad;
    const name = prasad?.name || 'Unknown Item';
    const description = prasad?.description || '';
    const price = cartItem.amount * cartItem.quantity;
    const image = prasad?.featuredImage || prasad?.images?.[0];
    const stock = prasad?.stock ?? 0;

    return (
        <div className="relative border-b border-gray-100 pb-4">
            <div className="flex items-start justify-between mb-3">
                <h4 className="font-secondaryFont text-sm font-semibold text-gray-900">{name}</h4>
                <button
                    onClick={() => onRemove(cartItem._id, cartItem.quantity)}
                    disabled={isUpdating}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Remove item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {image ? (
                        <LazyLoadImage src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-secondaryFont text-xs text-gray-500 leading-relaxed line-clamp-2">{description}</p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <span className="font-secondaryFont text-xs text-gray-500">Quantity</span>
                        <span className="font-secondaryFont text-xs text-gray-400">{stock > 0 ? `In stock: ${stock}` : 'Out of stock'}</span>
                    </div>
                    <div className="flex items-center gap-1 border border-gray-300 rounded">
                        <button
                            onClick={() => onQuantityChange(cartItem._id, -1)}
                            disabled={isUpdating || cartItem.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="font-secondaryFont text-sm font-semibold w-8 text-center">{cartItem.quantity}</span>
                        <button
                            onClick={() => onQuantityChange(cartItem._id, 1)}
                            disabled={isUpdating || stock <= 0 || cartItem.quantity >= stock}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                        >
                            <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="font-secondaryFont text-base font-bold text-gray-900">₹{price.toFixed(2)}</div>
            </div>
        </div>
    );
};

export const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: cartData, isLoading, refetch } = useGetCart();
    const { data: addressesData, isLoading: isLoadingAddresses, refetch: refetchAddresses } = useGetUserAddresses();
    const updateCartMutation = useUpdateCartItem();
    const createOrderMutation = useCreateOrder();
    const verifyPaymentMutation = useVerifyPayment();
    const setPreferredAddressMutation = useSetPreferredAddress();
    const addAddressMutation = useAddUserAddress();
    const updateAddressMutation = useUpdateUserAddress();
    const deleteAddressMutation = useDeleteUserAddress();

    const [cartItems, setCartItems] = useState<CartItemData[]>([]);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<AddressModel | null>(null);
    const [isAddEditAddressOpen, setIsAddEditAddressOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressModel | null>(null);

    useEffect(() => {
        refetch();
        // ensure page scroll is normal (no body lock here)
    }, [refetch]);

    useEffect(() => {
        if (cartData?.data) {
            if ('cart' in cartData.data && cartData.data.cart?.items && Array.isArray(cartData.data.cart.items)) {
                setCartItems(cartData.data.cart.items);
            } else if ('items' in cartData.data && cartData.data.items && Array.isArray(cartData.data.items)) {
                setCartItems(cartData.data.items);
            }
        }
    }, [cartData]);

    useEffect(() => {
        if (addressesData?.data && Array.isArray(addressesData.data) && addressesData.data.length > 0) {
            const preferredAddress = addressesData.data.find((addr: AddressModel) => addr.isPreferred);
            setSelectedAddress(preferredAddress || addressesData.data[0]);
        }
    }, [addressesData]);

    const handleOpenAddAddressModal = () => {
        setEditingAddress(null);
        setIsAddEditAddressOpen(true);
    };

    const handleEditAddress = (address: AddressModel) => {
        setEditingAddress(address);
        setIsAddEditAddressOpen(true);
    };

    const handleSelectAddress = async (address: AddressModel) => {
        try {
            await setPreferredAddressMutation.mutateAsync(address._id);
            setSelectedAddress(address);
            setIsAddressModalOpen(false);
            toast.success('Delivery address updated');
        } catch (error) {
            toast.error('Failed to update preferred address');
        }
    };

    const handleCloseAddEdit = () => {
        setIsAddEditAddressOpen(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = async (payload: any, addressId?: string) => {
        try {
            if (addressId) {
                await updateAddressMutation.mutateAsync({ addressId, payload });
                toast.success('Address updated successfully');
            } else {
                await addAddressMutation.mutateAsync(payload);
                toast.success('Address added successfully');
            }
            await refetchAddresses();
        } catch (error: any) {
            console.error('Error saving address:', error);
            toast.error(error?.response?.data?.message || 'Failed to save address. Please try again.');
            throw error;
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        try {
            await deleteAddressMutation.mutateAsync(addressId);
            toast.success('Address deleted successfully');
            await refetchAddresses();
        } catch (error: any) {
            console.error('Error deleting address:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete address. Please try again.');
            throw error;
        }
    };

    const suggestedProducts = [
        { id: 1, name: 'Prasad Plan 1', price: 400 },
        { id: 2, name: 'Prasad Plan 2', price: 999 },
        { id: 3, name: 'Prasad Plan 1', price: 400 },
        { id: 4, name: 'Prasad Plan 1', price: 400 },
    ];

    const handleQuantityChange = (id: string, change: number) => {
        const action = change > 0 ? 'add' : 'remove';
        const quantity = Math.abs(change);
        const current = cartItems.find((ci) => ci._id === id);
        const stock = current?.prasad?.stock ?? 0;
        const currentQty = current?.quantity ?? 0;

        if (change > 0) {
            const availableToAdd = stock - currentQty;
            if (availableToAdd <= 0) {
                toast.error(`Only ${stock} item${stock === 1 ? '' : 's'} in stock`);
                return;
            }
            const toAdd = Math.min(quantity, availableToAdd);
            if (toAdd < quantity) {
                toast(`Only ${availableToAdd} additional item${availableToAdd === 1 ? '' : 's'} can be added`, { icon: '⚠️' });
            }
            updateCartMutation.mutate(
                { itemId: id, data: { action: 'add', quantity: toAdd } },
                {
                    onSuccess: () => refetch(),
                    onError: (error) => {
                        console.error('Error updating cart item:', error);
                        toast.error('Failed to update cart item. Please try again.');
                    },
                },
            );
            return;
        }

        updateCartMutation.mutate(
            { itemId: id, data: { action, quantity } },
            {
                onSuccess: () => refetch(),
                onError: (error) => {
                    console.error('Error updating cart item:', error);
                    toast.error('Failed to update cart item. Please try again.');
                },
            },
        );
    };

    const handleRemoveItem = (id: string, quantity?: number) => {
        let qtyToRemove = 0;
        if (typeof quantity === 'number' && quantity > 0) {
            qtyToRemove = quantity;
        } else {
            const found = cartItems.find((ci) => ci._id === id);
            qtyToRemove = found ? found.quantity : 0;
        }

        updateCartMutation.mutate(
            { itemId: id, data: { action: 'remove', quantity: qtyToRemove } },
            {
                onSuccess: () => refetch(),
                onError: (error) => {
                    console.error('Error removing cart item:', error);
                    toast.error('Failed to remove cart item. Please try again.');
                },
            },
        );
    };

    const calculateSubtotal = () => {
        if (cartData?.data) {
            if ('cart' in cartData.data && cartData.data.cart?.totalAmount) {
                return cartData.data.cart.totalAmount;
            }
            if ('totalAmount' in cartData.data && cartData.data.totalAmount) {
                return (cartData.data as any).totalAmount as number;
            }
        }
        return cartItems.reduce((sum, item) => sum + item.amount, 0);
    };

    const getCharges = () => {
        if (cartData?.data && 'charges' in cartData.data) {
            return (cartData.data as any).charges;
        }
        return { deliveryCharges: 0, serviceFee: 0, taxes: 0 };
    };

    const getTotal = () => {
        if (cartData?.data && 'grandTotal' in cartData.data) {
            return (cartData.data as any).grandTotal as number;
        }
        const subtotal = calculateSubtotal();
        const charges = getCharges();
        return subtotal + charges.deliveryCharges + charges.serviceFee + charges.taxes;
    };

    const charges = getCharges();
    const shipping = charges.deliveryCharges;
    const serviceFee = charges.serviceFee;
    const vatax = charges.taxes;
    const subtotal = calculateSubtotal();
    const total = getTotal();

    const hasStockIssue = cartItems.some((item) => {
        const stock = item.prasad?.stock ?? 0;
        return stock <= 0 || item.quantity > stock;
    });

    const handleProceedToPayment = async () => {
        let cartId: string | undefined;

        if (cartData?.data) {
            if ('cart' in cartData.data && cartData.data.cart?._id) {
                cartId = (cartData.data as any).cart._id;
            } else if ('_id' in cartData.data && (cartData.data as any)._id) {
                cartId = (cartData.data as any)._id;
            }
        }

        if (!cartId) {
            toast.error('Cart ID not found');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        if (
            cartItems.some((item) => {
                const stock = item.prasad?.stock ?? 0;
                return stock <= 0 || item.quantity > stock;
            })
        ) {
            toast.error('One or more items in your cart exceed available stock or are out of stock. Please adjust quantities.');
            return;
        }

        setIsProcessingPayment(true);

        try {
            const orderResponse = await createOrderMutation.mutateAsync(cartId);

            const loadRazorpayScript = () =>
                new Promise<boolean>((resolve) => {
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

            const orderData = (orderResponse as any)?.data || (orderResponse as any)?.order || orderResponse;
            const orderId = orderData?.id || orderData?.order_id;
            const orderAmount = orderData?.amount || total * 100;
            const orderCurrency = orderData?.currency || 'INR';

            const options = {
                key: (import.meta as any).env?.VITE_RAZORPAY_KEY || '',
                amount: orderAmount,
                currency: orderCurrency,
                name: 'SM SHSEWA TRUST',
                description: 'Prasad Order',
                image: '/src/assets/images/SMSHFavicon.png', // SHMS icon
                order_id: orderId,
                prefill: {
                    name: (localStorage.getItem('name') || '') as string,
                    email: (localStorage.getItem('email') || '') as string,
                    contact: (localStorage.getItem('phone') || '') as string,
                },
                theme: { color: '#8B0000' },
                handler: async (response: any) => {
                    try {
                        const verifyPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        const verifyResponse = await verifyPaymentMutation.mutateAsync(verifyPayload);

                        if (verifyResponse && (verifyResponse as any).success) {
                            toast.success('Payment verified successfully!');
                            navigate('/prashad-order-history');
                            refetch();
                        } else {
                            toast.error('Payment completed but verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error('Payment completed but verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: () => setIsProcessingPayment(false),
                },
            } as any;

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Failed to initiate payment. Please try again.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    return (
        <Layout>
            <div className="w-full min-h-screen lg:h-screen flex flex-col px-4 md:px-16 lg:px-24 pb-4">
                {/* Top bar */}
                <div className="flex items-center gap-3 h-14 flex-shrink-0">
                    <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-gray-900" aria-label="Back">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="font-secondaryFont text-xl sm:text-2xl font-semibold text-gray-900">Checkout</h2>
                </div>

                {/* Two-column content area - full height with proper scroll behavior */}
                <div className="flex flex-col lg:flex-row gap-12 flex-1 min-h-0 ">
                    {/* Left column: content with fixed sections */}
                    <div className="flex-1 lg:flex-[2] order-1 lg:order-1 flex flex-col min-h-0">
                        {/* Non-scrollable sections */}
                        <div className="flex-shrink-0 space-y-3">
                            <div className="border border-gray-200 rounded-2xl p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 2a6 6 0 00-6 6c0 3.75 6 10 6 10s6-6.25 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </div>
                                        <span className="font-secondaryFont text-sm text-gray-500">Delivery address</span>
                                    </div>
                                    {selectedAddress && (
                                        <button className="px-4 py-1 text-xs font-semibold text-red-600 border border-red-600 rounded-full hover:bg-red-50">
                                            {selectedAddress.type}
                                        </button>
                                    )}
                                </div>
                                <div className="mb-2">
                                    <p className="font-secondaryFont text-base font-semibold text-gray-900">
                                        {selectedAddress ? selectedAddress.address : 'No address selected'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-secondaryFont text-sm text-gray-700">{selectedAddress?.name || 'N/A'}</span>
                                        <span className="font-secondaryFont text-sm text-gray-400">{selectedAddress?.phoneNumber ? `+${selectedAddress.phoneNumber}` : ''}</span>
                                    </div>
                                    <button className="text-red-600 hover:text-red-700" onClick={() => setIsAddressModalOpen(true)}>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Desktop-only note card (hidden on mobile) */}
                            <div className="hidden lg:block border border-gray-200 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Edit className="w-5 h-5 text-red-600" />
                                    <span className="font-secondaryFont text-sm text-gray-700">
                                        Got a special request? <span className="text-red-600 font-semibold">Write a note</span>
                                    </span>
                                </div>
                                <input type="text" placeholder="Write Note (Optional)" className="w-full font-secondaryFont text-sm text-gray-400 border-0 outline-none bg-transparent" />
                            </div>

                            {/* Desktop-only suggestions (hidden on mobile) */}
                            <div className="hidden lg:block">
                                <h3 className="font-secondaryFont text-base font-semibold text-gray-900 mb-4">You Might also like</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {suggestedProducts.map((product) => (
                                        <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                            <div className="aspect-square bg-gray-200 relative">
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="p-2 text-center">
                                                <p className="font-secondaryFont text-xs text-gray-700 mb-1">{product.name}</p>
                                                <p className="font-secondaryFont text-sm font-bold text-red-600">₹{product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile-only sequence: order -> note -> suggestions -> payment summary -> payment button */}
                            <div className="block lg:hidden space-y-4">
                                {/* Order list (mobile) */}
                                <div className="bg-white rounded-2xl p-4 border border-gray-200">
                                    <h3 className="font-secondaryFont text-sm font-semibold text-gray-900 mb-3">Your Order</h3>
                                    <div>
                                        {isLoading ? (
                                            <div className="text-center py-6">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b0000] mx-auto"></div>
                                                <p className="mt-2 text-sm text-gray-500">Loading cart...</p>
                                            </div>
                                        ) : cartItems.length === 0 ? (
                                            <div className="text-center py-6">
                                                <p className="text-gray-500 font-secondaryFont">Your cart is empty</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {cartItems.map((item) => (
                                                    <CartItemDisplay
                                                        key={item._id}
                                                        cartItem={item}
                                                        onQuantityChange={handleQuantityChange}
                                                        onRemove={handleRemoveItem}
                                                        isUpdating={updateCartMutation.isPending}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile note */}
                                <div className="bg-white rounded-2xl p-4 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Edit className="w-5 h-5 text-red-600" />
                                        <span className="font-secondaryFont text-sm text-gray-700">
                                            Got a special request? <span className="text-red-600 font-semibold">Write a note</span>
                                        </span>
                                    </div>
                                    <input type="text" placeholder="Write Note (Optional)" className="w-full font-secondaryFont text-sm text-gray-400 border-0 outline-none bg-transparent" />
                                </div>

                                {/* Mobile suggestions */}
                                <div>
                                    <h3 className="font-secondaryFont text-base font-semibold text-gray-900 mb-4">You Might also like</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {suggestedProducts.map((product) => (
                                            <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="aspect-square bg-gray-200 relative">
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="p-2 text-center">
                                                    <p className="font-secondaryFont text-xs text-gray-700 mb-1">{product.name}</p>
                                                    <p className="font-secondaryFont text-sm font-bold text-red-600">₹{product.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Summary (mobile) - Now at the bottom */}
                                <div className="bg-white rounded-2xl p-4 border border-gray-200 border-2 border-[#8b0000]">
                                    <h3 className="font-secondaryFont text-base font-semibold text-gray-900 mb-3">Payment Summary</h3>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-secondaryFont text-sm text-gray-600">Subtotal</span>
                                            <span className="font-secondaryFont text-sm font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-secondaryFont text-sm text-gray-600">Delivery</span>
                                            <span className="font-secondaryFont text-sm font-semibold text-gray-900">₹{shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-secondaryFont text-sm text-gray-600">Service Fee</span>
                                            <span className="font-secondaryFont text-sm font-semibold text-gray-900">₹{serviceFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-secondaryFont text-sm text-gray-600">Taxes</span>
                                            <span className="font-secondaryFont text-sm font-semibold text-gray-900">₹{vatax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-3">
                                            <span className="font-secondaryFont text-base font-bold text-gray-900">Total Amount</span>
                                            <span className="font-secondaryFont text-lg font-bold text-[#8b0000]">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Mobile payment button - Now inside payment summary */}
                                    <button
                                        onClick={handleProceedToPayment}
                                        disabled={isProcessingPayment || cartItems.length === 0 || hasStockIssue}
                                        className="w-full bg-[#8b0000] hover:bg-[#660000] text-white font-secondaryFont font-semibold py-4 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessingPayment ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Processing...
                                            </>
                                        ) : hasStockIssue ? (
                                            'Check Stock Issues'
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                                </svg>
                                                Proceed to Payment 
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Payment button section - fixed at bottom with proper spacing */}
                        {/* Desktop-only payment area (hidden on mobile) */}
                        <div className="hidden lg:block mt-auto pt-6 pb-4 flex-shrink-0">
                            <button
                                onClick={handleProceedToPayment}
                                disabled={isProcessingPayment || cartItems.length === 0 || hasStockIssue}
                                className="w-full bg-[#8b0000] hover:bg-[#660000] text-white font-secondaryFont font-semibold py-4 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessingPayment ? 'Processing...' : hasStockIssue ? 'Check stock' : `Proceed to Payment `}
                            </button>
                        </div>
                    </div>

                    {/* Right column: order summary with scroll */}
                    <div className="hidden lg:flex lg:flex-[1] order-2 lg:order-2 flex-col min-h-0 bg-gray-50 rounded-2xl p-6">
                        <h3 className="font-secondaryFont text-lg font-semibold text-gray-900 mb-6 flex-shrink-0">Your Order</h3>

                        {/* Items list: scrollable area */}
                        <div className="flex-1 min-h-0 mb-6">
                            {isLoading ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b0000] mx-auto"></div>
                                        <p className="mt-2 text-sm text-gray-500">Loading cart...</p>
                                    </div>
                                </div>
                            ) : cartItems.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center py-8">
                                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <p className="text-gray-500 font-secondaryFont">Your cart is empty</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                    <div className="space-y-6">
                                        {cartItems.map((item) => (
                                            <CartItemDisplay
                                                key={item._id}
                                                cartItem={item}
                                                onQuantityChange={handleQuantityChange}
                                                onRemove={handleRemoveItem}
                                                isUpdating={updateCartMutation.isPending}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fixed summary section at bottom */}
                        <div className="flex-shrink-0 bg-white p-4 rounded-xl border border-gray-200">
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-secondaryFont text-sm text-gray-600">Subtotal</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-secondaryFont text-sm text-gray-600">Delivery Charges</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">₹{shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-secondaryFont text-sm text-gray-600">Service Fee</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">₹{serviceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                    <span className="font-secondaryFont text-sm text-gray-600">Taxes</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">₹{vatax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="font-secondaryFont text-base font-bold text-gray-900">Total</span>
                                <span className="font-secondaryFont text-lg font-bold text-[#8b0000]">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Selection Modal */}
                <AddressSelectionModal
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    addresses={addressesData?.data || []}
                    selectedAddress={selectedAddress}
                    isLoading={isLoadingAddresses}
                    onSelectAddress={handleSelectAddress}
                    onEditAddress={handleEditAddress}
                    onAddNew={handleOpenAddAddressModal}
                    showDeleteButton={true}
                    onDeleteAddress={handleDeleteAddress}
                />

                {/* Add/Edit Address Modal */}
                <AddressFormModal
                    isOpen={isAddEditAddressOpen}
                    onClose={handleCloseAddEdit}
                    editingAddress={editingAddress}
                    config={{
                        showDeleteButton: true,
                        onSubmit: handleSaveAddress,
                        onDelete: handleDeleteAddress,
                    }}
                    isLoading={addAddressMutation.isPending || updateAddressMutation.isPending || deleteAddressMutation.isPending}
                />
            </div>
        </Layout>
    );
};

export default CheckoutPage;
