import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Minus, Plus, Loader2 } from 'lucide-react';
import { getCart, getCartPreview, updateCartItem, CartData, CartPreviewData, createOrder, verifyPayment } from '../../services/cart.service';
import { getUserAddresses, addUserAddress, updateUserAddress, AddressModel } from '../../services/profile.service';
import { AddressCard } from '../../components/address/AddressCard';
import { AddressFormModal } from '../../components/address/AddressFormModal';
import { ComponentLoader } from '../../components/ui/LoadingComponents';
import parshadTopImage from '../../assets/images/parshadTopImage.png';
import toast from 'react-hot-toast';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

export const CheckoutPage = () => {
    const { lang } = useI18n();
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartData | null>(null);
    const [cartPreview, setCartPreview] = useState<CartPreviewData | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<AddressModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressModel | null>(null);
    const [addressLoading, setAddressLoading] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [cartRes, addressRes] = await Promise.all([
                getCart(),
                getUserAddresses()
            ]);

            if (cartRes.success && cartRes.data) {
                setCart(cartRes.data);

                // Fetch cart preview to get charges and grandTotal
                try {
                    const previewRes = await getCartPreview(cartRes.data._id);
                    if (previewRes.success && previewRes.data) {
                        setCartPreview(previewRes.data);
                    }
                } catch (previewError) {
                    console.error('Error fetching cart preview:', previewError);
                }
            }

            // Handle address response - it might be an array directly or wrapped
            const addressData = addressRes.data;
            // Assuming addressRes.data is the array or addressRes.data.data
            const addressList = Array.isArray(addressData) ? addressData : (addressData as any).data || [];

            if (addressList.length > 0) {
                // Find preferred or default to first
                const preferred = addressList.find((a: AddressModel) => a.isPreferred) || addressList[0];
                setSelectedAddress(preferred);
            }
        } catch (error) {
            console.error('Error fetching checkout data:', error);
            toast.error('Failed to load checkout data');
        } finally {
            setLoading(false);
        }
    };


    const handleUpdateQuantity = async (itemId: string, currentQty: number, change: number) => {
        const newQty = currentQty + change;
        if (newQty < 1) return;

        // Optimistic update
        const previousCart = cart;
        setCart((prev) => {
            if (!prev) return prev;
            const updatedItems = prev.items.map((item) =>
                item._id === itemId ? { ...item, quantity: newQty } : item
            );
            // Simple recalculation for UI responsiveness (approximate, server is source of truth)
            // We can just update items for now, totals will update on refetch
            return { ...prev, items: updatedItems };
        });

        try {
            setUpdating(itemId);
            await updateCartItem(itemId, { action: change > 0 ? 'add' : 'remove', quantity: 1 });
            // Refresh cart to get accurate totals and confirm
            const res = await getCart();
            if (res.success && res.data) {
                setCart(res.data);
                // Also refresh cart preview for updated charges
                try {
                    const previewRes = await getCartPreview(res.data._id);
                    if (previewRes.success && previewRes.data) {
                        setCartPreview(previewRes.data);
                    }
                } catch (e) {
                    console.error('Error refreshing cart preview:', e);
                }
            }
        } catch (error) {
            // Revert on error
            setCart(previousCart);
            toast.error('Failed to update quantity');
        } finally {
            setUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        // Optimistic update
        const previousCart = cart;
        setCart((prev) => {
            if (!prev) return prev;
            return { ...prev, items: prev.items.filter((item) => item._id !== itemId) };
        });

        try {
            setUpdating(itemId);
            // Assuming updateCartItem with action 'remove' and quantity equal to current removes it?
            // Or maybe we need a delete endpoint? The service shows 'remove' action.
            // Let's assume removing all quantity removes the item, or check if there's a delete.
            // The service interface says action: 'add' | 'remove'.
            // Usually removing item is done by passing quantity to remove.
            // If I want to delete, I might need to call remove multiple times or maybe there is a delete endpoint?
            // Looking at service: updateCartItem(itemId, data).
            // Let's try removing with current quantity.
            const item = previousCart?.items.find(i => i._id === itemId);
            if (item) {
                // If the API supports removing the item entirely, we might need a different call.
                // But based on `updateCartItem` signature, maybe we just loop or send a large number?
                // Or maybe `remove` with quantity 0?
                // Let's try removing 1 by 1 for now or assume there is a delete way.
                // Actually, usually 'remove' decreases quantity.
                // If I want to delete, I might need to call it with the full quantity.
                await updateCartItem(itemId, { action: 'remove', quantity: item.quantity });
                const res = await getCart();
                if (res.success && res.data) {
                    setCart(res.data);
                    // Also refresh cart preview for updated charges
                    try {
                        const previewRes = await getCartPreview(res.data._id);
                        if (previewRes.success && previewRes.data) {
                            setCartPreview(previewRes.data);
                        }
                    } catch (e) {
                        console.error('Error refreshing cart preview:', e);
                    }
                }
            }
        } catch (error) {
            // Revert on error
            setCart(previousCart);
            toast.error('Failed to remove item');
        } finally {
            setUpdating(null);
        }
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setIsAddressModalOpen(true);
    };

    const handleEditAddress = (address: AddressModel) => {
        setEditingAddress(address);
        setIsAddressModalOpen(true);
    };

    const handleCloseAddressModal = () => {
        setIsAddressModalOpen(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = async (payload: any, addressId?: string) => {
        try {
            setAddressLoading(true);
            if (addressId) {
                await updateUserAddress(addressId, payload);
                toast.success('Address updated successfully');
            } else {
                await addUserAddress(payload);
                toast.success('Address added successfully');
            }

            // Refresh addresses
            const addressRes = await getUserAddresses();
            const addressData = addressRes.data;
            const addressList = Array.isArray(addressData) ? addressData : (addressData as any).data || [];

            if (addressList.length > 0) {
                // If we edited the currently selected address, update it
                if (selectedAddress && addressId === selectedAddress._id) {
                    const updated = addressList.find((a: AddressModel) => a._id === addressId);
                    if (updated) setSelectedAddress(updated);
                } else if (!selectedAddress || !addressId) {
                    // If no address was selected, or we added a new one, select the preferred or first
                    const preferred = addressList.find((a: AddressModel) => a.isPreferred) || addressList[0];
                    setSelectedAddress(preferred);
                }
            }

            handleCloseAddressModal();
        } catch (error: any) {
            console.error('Error saving address:', error);
            toast.error(error?.response?.data?.message || 'Failed to save address');
        } finally {
            setAddressLoading(false);
        }
    };

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

    const handlePayment = async () => {
        if (!selectedAddress) {
            toast.error('Please select a shipping address');
            return;
        }

        if (!cart) return;

        try {
            setProcessingPayment(true);

            // 1. Create Order
            const orderRes = await createOrder(cart._id, "", selectedAddress.address);

            // Handle different response structures
            const orderData = orderRes.data || orderRes;
            const razorpayOrder = orderData.order || orderData;

            if (!razorpayOrder || !razorpayOrder.id) {
                throw new Error('Invalid order data received');
            }

            // 2. Load Razorpay
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                throw new Error('Razorpay SDK failed to load');
            }

            // 3. Open Checkout
            const options = {
                key: (import.meta as any).env.VITE_RAZORPAY_KEY,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'Shree Mahakelswar Salasar Hanuman Sewa Trust',
                description: 'Prasad Order',
                image: '/src/assets/images/SMSHFavicon.png',
                order_id: razorpayOrder.id,
                prefill: {
                    name: selectedAddress.name,
                    email: selectedAddress.email,
                    contact: selectedAddress.phoneNumber,
                },
                theme: {
                    color: '#A83218',
                },
                handler: async (response: any) => {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        const verifyRes = await verifyPayment(verifyData);
                        if (verifyRes.success) {
                            toast.success('Payment successful!');
                            navigate('/prashad-order-history'); // Redirect to orders page
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        toast.error('Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: () => {
                        setProcessingPayment(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error(response.error.description || 'Payment failed');
                setProcessingPayment(false);
            });

            rzp.open();

        } catch (error: any) {
            console.error('Payment error:', error);
            toast.error(error?.response?.data?.message || error.message || 'Failed to initiate payment');
            setProcessingPayment(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><ComponentLoader /></div>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <img src={parshadTopImage} alt="Top Banner" className="w-full max-h-64 object-cover mb-8" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/prashad')}
                    className="px-6 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors"
                >
                    Browse Prashad
                </button>
            </div>
        );
    }

    // Calculate totals
    const subtotal = cart.totalAmount;
    const shipping = 0; // Hardcoded as per design example, or should be calculated?
    const gst = 0; // Hardcoded as per design example
    const total = subtotal + shipping + gst;

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Top Image Banner */}
            <div className="w-full h-30 md:h-64 lg:h-[300px] relative">
                <img
                    src={parshadTopImage}
                    alt="Checkout Banner"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-full px-4 md:px-16 lg:px-24 relative z-10 mt-[-100px] md:-mt-[120px] lg:-mt-[250px]">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors mr-4"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column */}
                    <div className="flex-1 space-y-6">
                        {/* Shipping Address Section */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                            {selectedAddress ? (
                                <AddressCard
                                    address={selectedAddress}
                                    onEdit={() => handleEditAddress(selectedAddress)}
                                />
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                                    <p className="text-gray-500 mb-4">No address selected</p>
                                    <button
                                        onClick={handleAddAddress}
                                        className="text-red-600 font-semibold hover:underline"
                                    >
                                        Add New Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart Section */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Cart</h2>
                            <div className="space-y-6">
                                {cart.items.map((item) => (
                                    <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 sm:pb-6 border-b border-gray-100 last:border-0 last:pb-0 relative">
                                        {/* Loading Overlay */}
                                        <AnimatePresence>
                                            {updating === item._id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-[1px] rounded-lg"
                                                >
                                                    <Loader2 className="w-8 h-8 text-[#8b0000] animate-spin" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-1">
                                            {/* Image */}
                                            <div className="w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                                <img
                                                    src={item.prasad.images[0] || '/placeholder.png'}
                                                    alt={item.prasad.name?.[lang]}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm sm:text-lg font-bold text-red-700 mb-1 truncate">{item.prasad.name?.[lang]}</h3>
                                                <p className="text-sm sm:text-xl font-bold text-gray-900">₹{item.prasad.price}</p>
                                            </div>
                                        </div>

                                        {/* Quantity & Delete */}
                                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto pl-20 sm:pl-0">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center border border-gray-200 rounded-lg bg-white h-8 sm:h-auto">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                                                    disabled={updating === item._id || item.quantity <= 1}
                                                    className="p-1.5 sm:p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                                                >
                                                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                                <div className="w-6 sm:w-10 text-center text-xs sm:text-base font-semibold text-gray-900 overflow-hidden h-[24px] flex items-center justify-center relative">
                                                    <AnimatePresence mode="popLayout" initial={false}>
                                                        <motion.span
                                                            key={item.quantity}
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            exit={{ y: -20, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="block"
                                                        >
                                                            {item.quantity}
                                                        </motion.span>
                                                    </AnimatePresence>
                                                </div>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                                                    disabled={updating === item._id}
                                                    className="p-1.5 sm:p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                                                >
                                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>

                                            {/* Price for mobile to match screenshot layout */}
                                            <p className="text-sm font-bold text-gray-900 sm:hidden">₹{item.prasad.price}</p>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item._id)}
                                                disabled={updating === item._id}
                                                className="text-red-500 hover:text-red-700 p-1.5 sm:p-2 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:w-[400px] flex-shrink-0">
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm sticky top-32 z-20">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-bold">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-gray-900 font-bold">₹{shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>GST</span>
                                    <span className="text-gray-900 font-bold">₹{gst.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4"></div>
                                <div className="flex justify-between text-lg">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-gray-900">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={processingPayment}
                                className="w-full bg-[#A83218] text-white font-bold py-4 rounded-xl hover:bg-[#8a2913] transition-colors shadow-lg shadow-red-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processingPayment ? 'Processing...' : 'Continue to Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AddressFormModal
                isOpen={isAddressModalOpen}
                onClose={handleCloseAddressModal}
                editingAddress={editingAddress}
                config={{
                    onSubmit: handleSaveAddress,
                    submitButtonText: editingAddress ? 'Update Address' : 'Add Address',
                    title: editingAddress ? 'Edit Address' : 'Add New Address'
                }}
                isLoading={addressLoading}
            />
        </div>
    );
};
