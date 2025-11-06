import React from 'react';
import { AddressCard } from './AddressCard';
import { AddressModel } from './types';

interface AddressSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    addresses: AddressModel[];
    selectedAddress: AddressModel | null;
    isLoading?: boolean;
    onSelectAddress?: (address: AddressModel) => void;
    onEditAddress?: (address: AddressModel) => void;
    onAddNew?: () => void;
    showDeleteButton?: boolean;
    onDeleteAddress?: (addressId: string) => void;
}

export const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({
    isOpen,
    onClose,
    addresses,
    selectedAddress,
    isLoading = false,
    onSelectAddress,
    onEditAddress,
    onAddNew,
    showDeleteButton = false,
    onDeleteAddress,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200">
                    <h3 className="font-secondaryFont text-xl font-semibold text-gray-900">
                        Select Delivery Address
                    </h3>
                    <div className="flex-1" />
                    {onAddNew && (
                        <button
                            onClick={onAddNew}
                            className="mr-3 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-md hover:bg-red-100"
                        >
                            + Add New
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-5 h-5 text-gray-500"
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

                {/* Modal Content */}
                <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b0000] mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500">Loading addresses...</p>
                        </div>
                    ) : addresses && addresses.length > 0 ? (
                        <div className="space-y-4">
                            {addresses.map((addr: AddressModel) => (
                                <AddressCard
                                    key={addr._id}
                                    address={addr}
                                    isSelected={selectedAddress?._id === addr._id}
                                    showDeleteButton={showDeleteButton}
                                    onSelect={onSelectAddress}
                                    onEdit={onEditAddress}
                                    onDelete={onDeleteAddress}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <svg
                                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <p className="text-gray-500 font-secondaryFont mb-4">No addresses found</p>
                            <p className="text-sm text-gray-400 font-secondaryFont">
                                Please add an address to continue
                            </p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
