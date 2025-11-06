import React from 'react';
import { AddressModel } from './types';

interface AddressCardProps {
    address: AddressModel;
    isSelected?: boolean;
    showDeleteButton?: boolean;
    onSelect?: (address: AddressModel) => void;
    onEdit?: (address: AddressModel) => void;
    onDelete?: (addressId: string) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
    address,
    isSelected = false,
    showDeleteButton = false,
    onSelect,
    onEdit,
    onDelete,
}) => {
    const handleCardClick = () => {
        if (onSelect) {
            onSelect(address);
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(address);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(address._id);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className={`border rounded-2xl p-3 lg:p-4 transition-all ${onSelect ? 'cursor-pointer' : ''
                } ${isSelected
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                }`}
        >
            <div className="flex gap-3">
                {/* Radio button for selection (if selectable) */}
                {onSelect && (
                    <div className="flex-shrink-0 pt-1">
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-red-600 bg-red-600' : 'border-gray-300'
                                }`}
                        >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                    </div>
                )}

                {/* Location Icon */}
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-red-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle
                                cx="12"
                                cy="10"
                                r="3"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    <div className="mb-1">
                        <span className="text-xs sm:text-sm text-gray-500 font-normal">
                            Delivery address
                        </span>
                    </div>

                    <p className="text-sm sm:text-base text-gray-900 font-semibold mb-2 sm:mb-3 leading-relaxed">
                        {address.address}
                    </p>

                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span className="text-gray-900 font-semibold">{address.name}</span>
                        <span className="text-gray-400">+{address.phoneNumber}</span>
                    </div>
                </div>

                {/* Right column: Type badge at top, Action buttons at bottom */}
                <div className="flex flex-col justify-between items-end flex-shrink-0">
                    {/* Type badge */}
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                        {address.type}
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        {/* Delete button (conditional) */}
                        {showDeleteButton && onDelete && (
                            <button
                                onClick={handleDeleteClick}
                                aria-label="Delete address"
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <svg
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polyline
                                        points="3 6 5 6 21 6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <line
                                        x1="10"
                                        y1="11"
                                        x2="10"
                                        y2="17"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <line
                                        x1="14"
                                        y1="11"
                                        x2="14"
                                        y2="17"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        )}

                        {/* Edit button (chevron) */}
                        {onEdit && (
                            <button
                                onClick={handleEditClick}
                                className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
                                aria-label="Edit address"
                            >
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-red-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        d="M9 18l6-6-6-6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
