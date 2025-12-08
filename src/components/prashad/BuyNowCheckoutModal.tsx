import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useGetCart } from '@/api/CartQueries';
import { useGetPrasadById } from '@/api/PrasadQueries';
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
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface BuyNowCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    prasadId: string;
    prasadName: string;
    prasadPrice: number;
    quantity: number;
    prasadImage?: string;
    onQuantityChange?: (newQuantity: number) => void;
    isUpdating?: boolean;
}

const BuyNowCheckoutModal: React.FC<BuyNowCheckoutModalProps> = ({
    isOpen,
    onClose,
    prasadId,
    prasadName,
    prasadPrice,
    quantity,
    prasadImage,
    onQuantityChange,
    isUpdating = false
}) => {
    const { t } = useI18n();
    // Address management state
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isAddressSelectionOpen, setIsAddressSelectionOpen] = useState(false);
    const [isAddEditAddressOpen, setIsAddEditAddressOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressModel | null>(null);
    const [localQuantity, setLocalQuantity] = useState(quantity);

    // Sync local quantity with prop when modal opens or prop changes
    useEffect(() => {
        if (isOpen) {
            setLocalQuantity(quantity);
        }
    }, [isOpen, quantity]);

    // API hooks
    const { data: addressesData, isLoading: isLoadingAddresses, refetch: refetchAddresses } = useGetUserAddresses();
    const addAddressMutation = useAddUserAddress();
    const updateAddressMutation = useUpdateUserAddress();
    const deleteAddressMutation = useDeleteUserAddress();

    // Use getCart to fetch the cart preview data (charges, taxes, total)
    const { data: cartResponse, isLoading: isLoadingCart } = useGetCart();

    const buyNowMutation = useBuyNow();
    const verifyPaymentMutation = useVerifyPayment();

    // Fetch prasad details to get stock information so we can prevent ordering more than available
    const { data: prasadDetails } = useGetPrasadById(prasadId, isOpen && !!prasadId);

    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Prevent background scrolling when modal is open using position: fixed strategy
    // Prevent background scrolling when modal is open using a robust class-based strategy
    useEffect(() => {
        if (!isOpen) return;

        const scrollY = window.scrollY;

        // Create a style element for the lock class
        const style = document.createElement('style');
        style.id = 'modal-scroll-lock';
        style.innerHTML = `
            .modal-open-lock {
                position: fixed !important;
                top: -${scrollY}px !important;
                width: 100% !important;
                height: 100% !important;
                overflow: hidden !important;
                overscroll-behavior: none !important;
                touch-action: none !important;
            }
            html.modal-open-lock {
                scroll-behavior: auto !important; /* prevent smooth scroll on restore */
            }
        `;
        document.head.appendChild(style);

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Save original padding
        const originalBodyPadding = document.body.style.paddingRight;

        // Apply lock class
        document.body.classList.add('modal-open-lock');
        document.documentElement.classList.add('modal-open-lock'); // Lock html too

        // Compensate scrollbar
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            // Remove styles
            const styleEl = document.getElementById('modal-scroll-lock');
            if (styleEl) styleEl.remove();

            // Remove classes
            document.body.classList.remove('modal-open-lock');
            document.documentElement.classList.remove('modal-open-lock');

            // Restore padding
            document.body.style.paddingRight = originalBodyPadding || '';

            // Restore scroll position immediately without smooth scrolling
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, scrollY);

            // Reset scroll behavior preference
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = '';
            }, 0);
        };
    }, [isOpen]);

    // Calculate charges from Cart API response
    const cartData = cartResponse?.data as any;
    const charges = cartData?.charges;

    const deliveryCharges = charges ? Number(charges.deliveryCharges || 0) : 0;
    const serviceFee = charges ? Number(charges.serviceFee || 0) : 0;
    const taxes = charges ? Number(charges.taxes || 0) : 0;

    const currentStock = prasadDetails?.data?.stock ?? Number.POSITIVE_INFINITY;

    // Map fields as requested:
    // Subtotal: cart.totalAmount
    // Shipping: charges.deliveryCharges
    // GST: charges.serviceFee + charges.taxes
    // Total: grandTotal

    const subtotal = cartData?.cart?.totalAmount || 0;
    const shipping = deliveryCharges;
    const vatTax = serviceFee + taxes;
    const totalAmount = cartData?.grandTotal || 0;


    const hasStockIssue = !isFinite(currentStock) ? false : (currentStock <= 0 || localQuantity > currentStock);

    // Get selected address
    const selectedAddress = addressesData?.data?.find((addr: AddressModel) => addr._id === selectedAddressId);

    // Handle quantity change
    const handleQuantityChange = (change: number) => {
        const newQuantity = localQuantity + change;

        // If new quantity is 0, triggers removal
        if (newQuantity === 0) {
            if (onQuantityChange) {
                onQuantityChange(0);
            }
            return;
        }

        // enforce min 1 and max = currentStock for updates
        if (newQuantity >= 1 && newQuantity <= currentStock) {
            setLocalQuantity(newQuantity);
            if (onQuantityChange) {
                onQuantityChange(newQuantity);
            }
        } else if (newQuantity > currentStock) {
            // optional: inform user when trying to exceed stock
            toast.error(t('prashad_checkout.onlyAvailable').replace('{{count}}', String(currentStock)));
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
                toast.success(t('prashad_checkout.itemRemoved'));
            } else {
                await addAddressMutation.mutateAsync(payload);
                toast.success(t('prashad_checkout.itemRemoved'));
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
        if (!window.confirm(t('prashad_checkout.removeConfirm'))) return;

        try {
            await deleteAddressMutation.mutateAsync(addressId);
            toast.success(t('prashad_checkout.itemRemoved'));
            if (selectedAddressId === addressId) {
                setSelectedAddressId(null);
            }
            await refetchAddresses();
        } catch (error: any) {
            console.error("Error deleting address:", error);
            toast.error(error?.response?.data?.message || t('prashad.section.failedAdd'));
        }
    };

    const proceedToPayment = async () => {
        if (!selectedAddressId) {
            toast.error(t('prashad_checkout.selectDeliveryAddress'));
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
                amount: (srv && (srv.amount || srv.amount_paid)) || totalAmount * 100,
                currency: (srv && srv.currency) || 'INR',
                name: 'SM SHSEWA TRUST',
                description: `Prasad - ${prasadName}`,
                image: '/src/assets/images/SMSHFavicon.png', // SHMS icon
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

    return createPortal(
        <>
            {/* Main Checkout Modal */}
            <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-black bg-opacity-60 backdrop-blur-sm p-4">
                <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                            aria-label="Back"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-semibold text-gray-900">{t('prashad_checkout.checkoutTitle')}</h2>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 overflow-y-auto flex-1">
                        {/* Shipping Address Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-600 mb-3">{t('prashad_checkout.shippingAddress')}</h3>

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
                                    <span className="font-medium">{t('prashad_checkout.addDeliveryAddressButton')}</span>
                                </button>
                            )}
                        </div>

                        {/* Your Order Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-600 mb-3">{t('prashad_checkout.yourOrder')}</h3>

                            <div className="bg-white rounded-xl relative">
                                {/* Loading Overlay */}
                                <AnimatePresence>
                                    {isUpdating && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px] rounded-xl"
                                        >
                                            <Loader2 className="w-6 h-6 text-[#8b0000] animate-spin" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Product Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="text-base font-medium text-gray-900">{prasadName}</h4>
                                    {/* Delete Icon */}
                                    <button
                                        onClick={() => {
                                            if (onQuantityChange) onQuantityChange(0);
                                        }}
                                        className="text-red-600 hover:text-red-700"
                                        aria-label="Remove item"
                                    >
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
                                                disabled={isUpdating}
                                                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                aria-label="Decrease quantity"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <div className="px-4 py-1 text-base font-medium text-gray-900 min-w-[40px] text-center overflow-hidden h-[24px] flex items-center justify-center relative">
                                                <AnimatePresence mode="popLayout" initial={false}>
                                                    <motion.span
                                                        key={localQuantity}
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -20, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="block"
                                                    >
                                                        {localQuantity}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </div>
                                            <button
                                                onClick={() => handleQuantityChange(1)}
                                                disabled={localQuantity >= currentStock || isUpdating}
                                                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                aria-label="Increase quantity"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" strokeLinejoin="round" />
                                                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                        {isFinite(currentStock) && (
                                            <p className="text-xs text-red-600 mt-1">{localQuantity >= currentStock ? `Only ${currentStock} available` : ``}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-2 py-4">
                            {isLoadingCart ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#AD2F16] mx-auto"></div>
                                    <p className="text-sm text-gray-500 mt-2">{t('prashad_checkout.loadingCharges')}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between text-base text-gray-700">
                                        <span>{t('prashad_checkout.subtotal')}</span>
                                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base text-gray-700">
                                        <span>{t('prashad_checkout.shipping')}</span>
                                        <span className="font-medium">₹{shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base text-gray-700">
                                        <span>{t('prashad_checkout.vatTax')}</span>
                                        <span className="font-medium">₹{vatTax.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-2 mt-2">
                                        <div className="flex justify-between text-xl font-bold text-gray-900">
                                            <span>{t('prashad_checkout.total')}</span>
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
                            disabled={isProcessingPayment || !selectedAddressId || isLoadingCart || hasStockIssue}
                            className="w-full bg-[#AD2F16] hover:bg-[#8B0000] text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessingPayment ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>{t('prashad_checkout.processing')}</span>
                                </>
                            ) : (
                                t('prashad_checkout.proceedToPayment')
                            )}
                        </button>
                        {hasStockIssue && (
                            <p className="mt-2 text-sm text-red-600">{currentStock <= 0 ? t('prashad_checkout.itemOutOfStock') : t('prashad_checkout.onlyAvailable').replace('{{count}}', String(currentStock))}</p>
                        )}
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
        </>,
        document.body
    );
};

export default BuyNowCheckoutModal;
