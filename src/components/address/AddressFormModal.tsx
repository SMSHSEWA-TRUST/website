import React, { useEffect } from 'react';
import { AddressForm } from './AddressForm';
import { useAddressForm } from './useAddressForm';
import { AddressModel, AddressFormConfig } from './types';
import toast from 'react-hot-toast';

interface AddressFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingAddress?: AddressModel | null;
    config?: AddressFormConfig;
    isLoading?: boolean;
}

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
    isOpen,
    onClose,
    editingAddress = null,
    config = {},
    isLoading = false,
}) => {
    const {
        addressForm,
        availableDistricts,
        addressErrors,
        handleAddressFormChange,
        resetForm,
        validateForm,
        buildAddressPayload,
        parseAddressToForm,
    } = useAddressForm(editingAddress);

    const {
        showDeleteButton = false,
        submitButtonText,
        title,
        onDelete,
        onSubmit,
        onCancel,
    } = config;

    // Reset form when editing address changes
    useEffect(() => {
        if (editingAddress) {
            parseAddressToForm(editingAddress);
        } else {
            resetForm();
        }
    }, [editingAddress]);

    const handleClose = () => {
        resetForm();
        if (onCancel) {
            onCancel();
        }
        onClose();
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            const firstError = Object.values(addressErrors)[0];
            if (firstError) {
                toast.error(firstError);
            }
            return;
        }

        try {
            const payload = buildAddressPayload();
            if (onSubmit) {
                await onSubmit(payload, editingAddress?._id);
            }
            handleClose();
        } catch (error: any) {
            console.error('Error saving address:', error);
            toast.error(error?.response?.data?.message || 'Failed to save address');
        }
    };

    const handleDelete = async () => {
        if (!editingAddress || !onDelete) return;

        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }

        try {
            await onDelete(editingAddress._id);
            handleClose();
        } catch (error: any) {
            console.error('Error deleting address:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete address');
        }
    };

    if (!isOpen) return null;

    const modalTitle = title || (editingAddress ? 'Edit Address' : 'Add New Address');
    const buttonText = submitButtonText || (editingAddress ? 'Update' : 'Add');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100001] p-2 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                    <h3 className="font-secondaryFont text-lg sm:text-xl font-semibold text-gray-900">
                        {modalTitle}
                    </h3>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                d="M18 6L6 18M6 6l12 12"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto max-h-[calc(95vh-160px)] sm:max-h-[calc(90vh-160px)]">
                    <AddressForm
                        formData={addressForm}
                        errors={addressErrors}
                        availableDistricts={availableDistricts}
                        onChange={handleAddressFormChange}
                        disabled={isLoading}
                    />
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
                    {/* Delete Button (conditional) */}
                    {showDeleteButton && editingAddress && onDelete && (
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Delete
                        </button>
                    )}

                    {/* Cancel Button */}
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-white bg-[#8b0000] rounded-lg hover:bg-[#660000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-3.5 h-3.5 sm:h-4 sm:w-4"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                {editingAddress ? 'Updating...' : 'Adding...'}
                            </span>
                        ) : (
                            buttonText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
