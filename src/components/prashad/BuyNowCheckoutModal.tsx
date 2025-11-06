import React, { useState } from 'react';
import { useGetPrasadCharge } from '@/api/ChargeQueries';
import { useBuyNow } from '@/api/BuyNowQueries';
import { useVerifyPayment } from '@/api/CartQueries';
import toast from 'react-hot-toast';
import { AddressFormModal, AddressSelectionModal, AddressModel } from '@/components/address';
import {
    useGetUserAddresses,
    useAddUserAddress,
    useUpdateUserAddress,
    useDeleteUserAddress
} from '@/api/ProfileQueries';

interface BuyNowCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    prasadId: string;
    prasadName: string;
    prasadPrice: number;
    quantity: number;
    prasadImage?: string;
    onQuantityChange?: (newQuantity: number) => void;
}

const BuyNowCheckoutModal: React.FC<BuyNowCheckoutModalProps> = ({
    isOpen,
    onClose,
    prasadId,
    prasadName,
    prasadPrice,
    quantity,
    prasadImage,
    onQuantityChange
}) => {
    // Address management state
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isAddressSelectionOpen, setIsAddressSelectionOpen] = useState(false);
    const [isAddEditAddressOpen, setIsAddEditAddressOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressModel | null>(null);
    const [localQuantity, setLocalQuantity] = useState(quantity);

    // API hooks
    const { data: addressesData, isLoading: isLoadingAddresses, refetch: refetchAddresses } = useGetUserAddresses();
    const addAddressMutation = useAddUserAddress();
    const updateAddressMutation = useUpdateUserAddress();
    const deleteAddressMutation = useDeleteUserAddress();
    const { data: chargesApiResp, isLoading: isLoadingCharges } = useGetPrasadCharge(prasadId, isOpen && !!prasadId);
    const buyNowMutation = useBuyNow();
    const verifyPaymentMutation = useVerifyPayment();

    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Calculate charges
    const chargeItem = (chargesApiResp && chargesApiResp.data && Array.isArray(chargesApiResp.data) && chargesApiResp.data[0]) || null;
    const deliveryCharges = chargeItem ? Number(chargeItem.deliveryCharges || 0) : 0;
    const serviceFee = chargeItem ? Number(chargeItem.serviceFee || 0) : 0;
    const taxes = chargeItem ? Number(chargeItem.taxes || 0) : 0;

    const subtotal = prasadPrice * localQuantity;
    const shipping = deliveryCharges;
    const vatTax = serviceFee + taxes;
    const totalAmount = Math.round(subtotal + shipping + vatTax);

    // Get selected address
    const selectedAddress = addressesData?.data?.find((addr: AddressModel) => addr._id === selectedAddressId);

    // Handle quantity change
    const handleQuantityChange = (change: number) => {
        const newQuantity = localQuantity + change;
        if (newQuantity >= 1) {
            setLocalQuantity(newQuantity);
            if (onQuantityChange) {
                onQuantityChange(newQuantity);
            }
        }
    };

    // Address handlers
    const handleSelectAddress = (address: AddressModel) => {
        setSelectedAddressId(address._id);
        setIsAddressSelectionOpen(false);
    };

    const handleOpenAddAddressModal = () => {
        setEditingAddress(null);
        setIsAddEditAddressOpen(true);
        setIsAddressSelectionOpen(false);
    };

    const handleEditAddress = (address: AddressModel) => {
        setEditingAddress(address);
        setIsAddEditAddressOpen(true);
        setIsAddressSelectionOpen(false);
    };

    const handleCloseAddEdit = () => {
        setIsAddEditAddressOpen(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = async (payload: any, addressId?: string) => {
        try {
            if (addressId) {
                await updateAddressMutation.mutateAsync({ addressId, payload });
                toast.success("Address updated successfully!");
            } else {
                await addAddressMutation.mutateAsync(payload);
                toast.success("Address added successfully!");
            }
            await refetchAddresses();
            handleCloseAddEdit();
        } catch (error: any) {
            console.error("Error saving address:", error);
            toast.error(error?.response?.data?.message || "Failed to save address");
            throw error;
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;

        try {
            await deleteAddressMutation.mutateAsync(addressId);
            toast.success("Address deleted successfully!");
            if (selectedAddressId === addressId) {
                setSelectedAddressId(null);
            }
            await refetchAddresses();
        } catch (error: any) {
            console.error("Error deleting address:", error);
            toast.error(error?.response?.data?.message || "Failed to delete address");
        }
    };

    const proceedToPayment = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address");
            return;
        }

        if (!prasadId) return;
        setIsProcessingPayment(true);

        try {
            const amountRupees = totalAmount;
            const serverOrder: any = await buyNowMutation.mutateAsync({
                prasadId,
                amount: amountRupees
            });

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

            const srv = serverOrder && (serverOrder.order || serverOrder.data || serverOrder);

            const options: any = {
                key: (import.meta as any).env?.VITE_RAZORPAY_KEY || '',
                amount: (srv && (srv.amount || srv.amount_paid)) || Math.round(prasadPrice * localQuantity) * 100,
                currency: (srv && srv.currency) || 'INR',
                name: 'SM SHSEWA TRUST',
                description: `Prasad - ${prasadName}`,
                prefill: {
                    name: (localStorage.getItem('name') || '') as string,
                    email: (localStorage.getItem('email') || '') as string,
                    contact: (localStorage.getItem('phone') || '') as string,
                },
                theme: { color: '#8B0000' },
                modal: { ondismiss: () => { setIsProcessingPayment(false); } },
            };

            if (srv && (srv.id || srv.order_id)) {
                options.order_id = srv.id || srv.order_id;
            } else {
                const returnedId = serverOrder && (serverOrder.id || serverOrder.order_id);
                if (returnedId) options.order_id = returnedId;
            }

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
                        onClose();
                    } else {
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

    if (!isOpen) return null;

    const isLoading = addAddressMutation.isPending || updateAddressMutation.isPending;

    return (
        <>
            {/* Main Checkout Modal */}
            <div className="fixed inset-0 z-[99999] flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
                    {/* Header */}
                    <div className="flex items-center px-6 py-4 border-b border-gray-200">
                        <button
                            onClick={onClose}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                            aria-label="Back"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-semibold text-gray-900">Checkout</h2>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {/* Shipping Address Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-600 mb-3">Shipping Address</h3>

                            {isLoadingAddresses ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AD2F16]"></div>
                                </div>
                            ) : selectedAddress ? (
                                <div
                                    onClick={() => setIsAddressSelectionOpen(true)}
                                    className="cursor-pointer bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow"
                                >
                                    {/* Address Card - Matching Checkout Design */}
                                    <div className="flex gap-3">
                                        {/* Location Icon */}
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <circle cx="12" cy="10" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 min-w-0">
                                            {/* Delivery address label */}
                                            <div className="mb-1">
                                                <span className="text-sm text-gray-500 font-normal">Delivery address</span>
                                            </div>

                                            {/* Address */}
                                            <p className="text-base text-gray-900 font-medium mb-2 leading-relaxed">
                                                {selectedAddress.address}
                                            </p>

                                            {/* Name and Phone */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-900 font-medium">{selectedAddress.name}</span>
                                                <span className="text-gray-500">+{selectedAddress.phoneNumber}</span>
                                            </div>
                                        </div>

                                        {/* Right column: Type badge and Arrow */}
                                        <div className="flex flex-col justify-between items-end flex-shrink-0">
                                            {/* Type badge at top */}
                                            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                                                {selectedAddress.type}
                                            </span>

                                            {/* Arrow button at bottom */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setIsAddressSelectionOpen(true); }}
                                                className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-2"
                                                aria-label="Change address"
                                            >
                                                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAddressSelectionOpen(true)}
                                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-500 hover:border-[#AD2F16] hover:text-[#AD2F16] transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="font-medium">Add Delivery Address</span>
                                </button>
                            )}
                        </div>

                        {/* Your Order Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-600 mb-3">Your Order</h3>

                            <div className="bg-white rounded-xl">
                                {/* Product Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="text-base font-medium text-gray-900">{prasadName}</h4>
                                    {/* Delete Icon */}
                                    <button className="text-red-600 hover:text-red-700" aria-label="Remove item">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
                                            <line x1="10" y1="11" x2="10" y2="17" strokeLinecap="round" strokeLinejoin="round" />
                                            <line x1="14" y1="11" x2="14" y2="17" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    {prasadImage && (
                                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={prasadImage}
                                                alt={prasadName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-1">-Vintage Highschool Jock Bully</p>
                                        <p className="text-sm text-gray-500 mb-3">-1960 Classic Edition</p>
                                        <p className="text-lg font-bold text-gray-900">₹{prasadPrice.toFixed(2)}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-end justify-end">
                                        <p className="text-sm text-gray-600 mb-2">Quantity</p>
                                        <div className="flex items-center gap-0 border border-gray-300 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => handleQuantityChange(-1)}
                                                disabled={localQuantity <= 1}
                                                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                aria-label="Decrease quantity"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <span className="px-4 py-1 text-base font-medium text-gray-900 min-w-[40px] text-center">
                                                {localQuantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(1)}
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" strokeLinejoin="round" />
                                                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-2 py-4">
                            {isLoadingCharges ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#AD2F16] mx-auto"></div>
                                    <p className="text-sm text-gray-500 mt-2">Loading charges...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between text-base text-gray-700">
                                        <span>Subtotal</span>
                                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base text-gray-700">
                                        <span>Shipping</span>
                                        <span className="font-medium">₹{shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base text-gray-700">
                                        <span>Vat,tax</span>
                                        <span className="font-medium">₹{vatTax.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-2 mt-2">
                                        <div className="flex justify-between text-xl font-bold text-gray-900">
                                            <span>Total</span>
                                            <span>₹{totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer with Payment Button */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <button
                            onClick={proceedToPayment}
                            disabled={isProcessingPayment || !selectedAddressId || isLoadingCharges}
                            className="w-full bg-[#AD2F16] hover:bg-[#8B0000] text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessingPayment ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                'Proceed to Payment'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Address Selection Modal */}
            <AddressSelectionModal
                isOpen={isAddressSelectionOpen}
                addresses={addressesData?.data || []}
                selectedAddress={selectedAddress || null}
                onSelectAddress={handleSelectAddress}
                onEditAddress={handleEditAddress}
                onAddNew={handleOpenAddAddressModal}
                onClose={() => setIsAddressSelectionOpen(false)}
                showDeleteButton={true}
                onDeleteAddress={handleDeleteAddress}
            />

            {/* Address Add/Edit Modal */}
            <AddressFormModal
                isOpen={isAddEditAddressOpen}
                onClose={handleCloseAddEdit}
                editingAddress={editingAddress}
                config={{
                    showDeleteButton: true,
                    onSubmit: handleSaveAddress,
                    onDelete: handleDeleteAddress,
                }}
                isLoading={isLoading}
            />
        </>
    );
};

export default BuyNowCheckoutModal;
