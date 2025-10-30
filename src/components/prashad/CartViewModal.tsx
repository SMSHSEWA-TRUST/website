import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Trash2, Minus, Plus, Edit } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useGetCart, useUpdateCartItem, useCreateOrder, useVerifyPayment } from '@/api/CartQueries';
import { useGetUserAddresses, useSetPreferredAddress } from '@/api/ProfileQueries';
import toast from 'react-hot-toast';

interface PrasadData {
    _id: string;
    name: string;
    description: string;
    images: string[];
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

interface AddressModel {
    _id: string;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    type: 'Home' | 'Office' | 'Other';
    isActive: boolean;
    isPreferred: boolean;
}

// Component to fetch and display individual cart item with prasad details
const CartItemDisplay: React.FC<{
    cartItem: CartItemData;
    onQuantityChange: (id: string, change: number) => void;
    onRemove: (id: string, quantity: number) => void;
    isUpdating?: boolean;
}> = ({ cartItem, onQuantityChange, onRemove, isUpdating = false }) => {
    // Prasad data is already included in the cart item
    const prasad = cartItem.prasad;

    const name = prasad?.name || "Unknown Item";
    const description = prasad?.description || "";
    const price = cartItem.amount * cartItem.quantity;
    const image = prasad?.images?.[0];

    return (
        <div className="relative border-b border-gray-100 pb-4">
            {/* Item Header with Name and Delete */}
            <div className="flex items-start justify-between mb-3">
                <h4 className="font-secondaryFont text-sm font-semibold text-gray-900">
                    {name}
                </h4>
                <button
                    onClick={() => onRemove(cartItem._id, cartItem.quantity)}
                    disabled={isUpdating}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Remove item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Item Image and Description */}
            <div className="flex gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {image ? (
                        <LazyLoadImage
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-secondaryFont text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>

            {/* Quantity and Price */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-secondaryFont text-xs text-gray-500">Quantity</span>
                    <div className="flex items-center gap-1 border border-gray-300 rounded">
                        <button
                            onClick={() => onQuantityChange(cartItem._id, -1)}
                            disabled={isUpdating || cartItem.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="font-secondaryFont text-sm font-semibold w-8 text-center">
                            {cartItem.quantity}
                        </span>
                        <button
                            onClick={() => onQuantityChange(cartItem._id, 1)}
                            disabled={isUpdating}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                        >
                            <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Price */}
                <div className="font-secondaryFont text-base font-bold text-gray-900">
                    ₹{price.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
    // Fetch cart data from API
    const { data: cartData, isLoading, refetch } = useGetCart();

    // Fetch user addresses from API
    const { data: addressesData, isLoading: isLoadingAddresses } = useGetUserAddresses();


    // Update cart item mutation
    const updateCartMutation = useUpdateCartItem();
    // Create order mutation
    const createOrderMutation = useCreateOrder();
    // Verify payment mutation
    const verifyPaymentMutation = useVerifyPayment();
    // Set preferred address mutation
    const setPreferredAddressMutation = useSetPreferredAddress();

    const [cartItems, setCartItems] = useState<CartItemData[]>([]);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<AddressModel | null>(null);    // Update items when cart data is fetched
    useEffect(() => {
        if (cartData?.data) {
            // Check if it's CartPreviewData structure with nested cart
            if ('cart' in cartData.data && cartData.data.cart?.items && Array.isArray(cartData.data.cart.items)) {
                setCartItems(cartData.data.cart.items);
            }
            // Check if it's CartData structure with direct items
            else if ('items' in cartData.data && cartData.data.items && Array.isArray(cartData.data.items)) {
                setCartItems(cartData.data.items);
            }
        }
    }, [cartData]);

    // Set default selected address (preferred or first address)
    useEffect(() => {
        if (addressesData?.data && Array.isArray(addressesData.data) && addressesData.data.length > 0) {
            const preferredAddress = addressesData.data.find((addr: AddressModel) => addr.isPreferred);
            setSelectedAddress(preferredAddress || addressesData.data[0]);
        }
    }, [addressesData]);

    // Refetch cart data when modal opens and lock body scroll
    useEffect(() => {
        if (isOpen) {
            refetch();
            // Lock body scroll when modal opens
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scroll when modal closes
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, refetch]);

    // Dummy "You Might also like" products
    const suggestedProducts = [
        { id: 1, name: "Prasad Plan 1", price: 400 },
        { id: 2, name: "Prasad Plan 2", price: 999 },
        { id: 3, name: "Prasad Plan 1", price: 400 },
        { id: 4, name: "Prasad Plan 1", price: 400 }
    ];

    const handleQuantityChange = (id: string, change: number) => {
        // Determine action based on change value
        const action = change > 0 ? 'add' : 'remove';
        const quantity = Math.abs(change);

        updateCartMutation.mutate(
            {
                itemId: id,
                data: {
                    action: action,
                    quantity: quantity,
                },
            },
            {
                onSuccess: () => {
                    console.log('Cart item updated successfully');
                    refetch();
                },
                onError: (error) => {
                    console.error('Error updating cart item:', error);
                    alert('Failed to update cart item. Please try again.');
                },
            }
        );
    };

    const handleRemoveItem = (id: string, quantity?: number) => {
        // If quantity not provided, try to find it from current state
        let qtyToRemove = 0;
        if (typeof quantity === 'number' && quantity > 0) {
            qtyToRemove = quantity;
        } else {
            const found = cartItems.find(ci => ci._id === id);
            qtyToRemove = found ? found.quantity : 0;
        }

        updateCartMutation.mutate(
            {
                itemId: id,
                data: {
                    action: 'remove',
                    quantity: qtyToRemove,
                },
            },
            {
                onSuccess: () => {
                    console.log('Cart item removed successfully');
                    refetch();
                },
                onError: (error) => {
                    console.error('Error removing cart item:', error);
                    alert('Failed to remove cart item. Please try again.');
                },
            }
        );
    };

    // Razorpay payment handler
    const handleProceedToPayment = async () => {
        let cartId: string | undefined;

        if (cartData?.data) {
            // Check if it's CartPreviewData structure
            if ('cart' in cartData.data && cartData.data.cart?._id) {
                cartId = cartData.data.cart._id;
            }
            // Check if it's CartData structure
            else if ('_id' in cartData.data && cartData.data._id) {
                cartId = cartData.data._id;
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

        setIsProcessingPayment(true);

        try {
            // Step 1: Create order on server
            const orderResponse = await createOrderMutation.mutateAsync(cartId);
            console.log('Order created:', orderResponse);

            // Step 2: Load Razorpay script
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
            if (!loaded) {
                throw new Error('Razorpay script failed to load');
            }

            // Step 3: Extract order details from response
            const orderData = orderResponse?.data || orderResponse?.order || orderResponse;
            const orderId = orderData?.id || orderData?.order_id;
            const orderAmount = orderData?.amount || total * 100; // Convert to paise
            const orderCurrency = orderData?.currency || 'INR';

            // Step 4: Configure Razorpay options
            const options = {
                key: (import.meta as any).env?.VITE_RAZORPAY_KEY || '',
                amount: orderAmount,
                currency: orderCurrency,
                name: 'SM SHSEWA TRUST',
                description: 'Prasad Order',
                order_id: orderId,
                prefill: {
                    name: (localStorage.getItem('name') || '') as string,
                    email: (localStorage.getItem('email') || '') as string,
                    contact: (localStorage.getItem('phone') || '') as string,
                },
                theme: { color: '#8B0000' },
                handler: async (response: any) => {
                    console.log('Payment successful:', response);

                    // Step 5: Verify payment on backend
                    try {
                        const verifyPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        const verifyResponse = await verifyPaymentMutation.mutateAsync(verifyPayload);

                        if (verifyResponse && verifyResponse.success) {
                            toast.success('Payment verified successfully!');
                            onClose();
                            refetch();
                        } else {
                            console.warn('Payment verification response:', verifyResponse);
                            toast.error('Payment completed but verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error('Payment completed but verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: () => {
                        console.log('Payment modal closed by user');
                        setIsProcessingPayment(false);
                    }
                }
            };

            // Step 6: Open Razorpay checkout
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Failed to initiate payment. Please try again.');
        } finally {
            setIsProcessingPayment(false);
        }
    };



    const calculateSubtotal = () => {
        // Use totalAmount from API if available, otherwise calculate from items
        if (cartData?.data) {
            // Check if it's CartPreviewData structure
            if ('cart' in cartData.data && cartData.data.cart?.totalAmount) {
                return cartData.data.cart.totalAmount;
            }
            // Check if it's CartData structure
            if ('totalAmount' in cartData.data && cartData.data.totalAmount) {
                return cartData.data.totalAmount;
            }
        }
        return cartItems.reduce((sum, item) => sum + item.amount, 0);
    };

    // Get charges from preview data or use defaults
    const getCharges = () => {
        if (cartData?.data && 'charges' in cartData.data) {
            return cartData.data.charges;
        }
        return {
            deliveryCharges: 0,
            serviceFee: 0,
            taxes: 0,
        };
    };

    // Get grand total from preview data or calculate
    const getTotal = () => {
        if (cartData?.data && 'grandTotal' in cartData.data) {
            return cartData.data.grandTotal;
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

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center overflow-y-auto" style={{ isolation: 'isolate' }}>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998]"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-8 mx-4 z-[99999]">
                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="text-gray-700 hover:text-gray-900"
                        aria-label="Close"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="font-secondaryFont text-2xl font-semibold text-gray-900">
                        Checkout
                    </h2>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Left Side - Main Content */}
                    <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
                        {/* Delivery Address */}
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
                                    <span className="font-secondaryFont text-sm text-gray-700">
                                        {selectedAddress?.name || 'N/A'}
                                    </span>
                                    <span className="font-secondaryFont text-sm text-gray-400">
                                        {selectedAddress?.phoneNumber ? `+${selectedAddress.phoneNumber}` : ''}
                                    </span>
                                </div>
                                <button
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => setIsAddressModalOpen(true)}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Special Request */}
                        <div className="border border-gray-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Edit className="w-5 h-5 text-red-600" />
                                <span className="font-secondaryFont text-sm text-gray-700">
                                    Got a special request? <span className="text-red-600 font-semibold">Write a note</span>
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Write Note (Optional)"
                                className="w-full font-secondaryFont text-sm text-gray-400 border-0 outline-none bg-transparent"
                            />
                        </div>

                        {/* You Might also like */}
                        <div>
                            <h3 className="font-secondaryFont text-base font-semibold text-gray-900 mb-4">
                                You Might also like
                            </h3>
                            <div className="grid grid-cols-4 gap-3">
                                {suggestedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-xl overflow-hidden"
                                    >
                                        <div className="aspect-square bg-gray-200 relative">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="p-2 text-center">
                                            <p className="font-secondaryFont text-xs text-gray-700 mb-1">
                                                {product.name}
                                            </p>
                                            <p className="font-secondaryFont text-sm font-bold text-red-600">
                                                ₹{product.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Proceed to Payment Button */}
                        <button
                            onClick={handleProceedToPayment}
                            disabled={isProcessingPayment || cartItems.length === 0}
                            className="w-full bg-[#8b0000] hover:bg-[#660000] text-white font-secondaryFont font-semibold py-4 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessingPayment ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="sticky top-6">
                            <h3 className="font-secondaryFont text-lg font-semibold text-gray-900 mb-6">
                                Your Order
                            </h3>

                            {/* Cart Items */}
                            <div className="space-y-6 mb-6">
                                {isLoading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b0000] mx-auto"></div>
                                        <p className="mt-2 text-sm text-gray-500">Loading cart...</p>
                                    </div>
                                ) : cartItems.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <p className="text-gray-500 font-secondaryFont">Your cart is empty</p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <CartItemDisplay
                                            key={item._id}
                                            cartItem={item}
                                            onQuantityChange={handleQuantityChange}
                                            onRemove={handleRemoveItem}
                                            isUpdating={updateCartMutation.isPending}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-secondaryFont text-sm text-gray-600">Subtotal</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">
                                        ₹{subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-secondaryFont text-sm text-gray-600">Delivery Charges</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">
                                        ₹{shipping.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-secondaryFont text-sm text-gray-600">Service Fee</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">
                                        ₹{serviceFee.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                    <span className="font-secondaryFont text-sm text-gray-600">Taxes</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">
                                        ₹{vatax.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between">
                                <span className="font-secondaryFont text-base font-bold text-gray-900">Total</span>
                                <span className="font-secondaryFont text-lg font-bold text-gray-900">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Selection Modal */}
                {isAddressModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                <h3 className="font-secondaryFont text-xl font-semibold text-gray-900">
                                    Select Delivery Address
                                </h3>
                                <button
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                {isLoadingAddresses ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b0000] mx-auto"></div>
                                        <p className="mt-2 text-sm text-gray-500">Loading addresses...</p>
                                    </div>
                                ) : addressesData?.data && addressesData.data.length > 0 ? (
                                    <div className="space-y-4">
                                        {addressesData.data.map((addr: AddressModel) => (
                                            <div
                                                key={addr._id}
                                                onClick={async () => {
                                                    try {
                                                        await setPreferredAddressMutation.mutateAsync(addr._id);
                                                        setSelectedAddress(addr);
                                                        setIsAddressModalOpen(false);
                                                        toast.success('Delivery address updated');
                                                    } catch (error) {
                                                        toast.error('Failed to update preferred address');
                                                    }
                                                }}
                                                className={`border rounded-2xl p-4 cursor-pointer transition-all ${selectedAddress?._id === addr._id
                                                    ? 'border-red-600 bg-red-50'
                                                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex gap-4">
                                                    {/* Radio Button */}
                                                    <div className="flex-shrink-0 pt-1">
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress?._id === addr._id
                                                                ? 'border-red-600 bg-red-600'
                                                                : 'border-gray-300'
                                                                }`}
                                                        >
                                                            {selectedAddress?._id === addr._id && (
                                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Location Icon */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                <circle cx="12" cy="10" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    {/* Address Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm text-gray-500 font-normal">Delivery address</span>
                                                            <span className="px-3 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                                                                {addr.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-base text-gray-900 font-semibold mb-2 leading-relaxed">
                                                            {addr.address}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-gray-900 font-semibold">{addr.name}</span>
                                                            <span className="text-gray-400">+{addr.phoneNumber}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-gray-500 font-secondaryFont mb-4">No addresses found</p>
                                        <p className="text-sm text-gray-400 font-secondaryFont">Please add an address in your profile section</p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <button
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );

    // Render modal using React Portal to ensure it's at document root level
    return createPortal(modalContent, document.body);
};

export default CheckoutModal;
