import React from 'react';
import statesData from '../../data/states-and-districts.json';
import { AddressFormData, AddressType, AddressErrors } from './types';

interface AddressFormProps {
    formData: AddressFormData;
    errors: AddressErrors;
    availableDistricts: string[];
    onChange: (field: string, value: string) => void;
    disabled?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
    formData,
    errors,
    availableDistricts,
    onChange,
    disabled = false,
}) => {
    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        disabled={disabled}
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        disabled={disabled}
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
            </div>

            {/* Mobile Number */}
            <div>
                <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                    Mobile No <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    placeholder="Enter Mobile Number"
                    value={formData.mobile}
                    onChange={(e) => onChange('mobile', e.target.value)}
                    disabled={disabled}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    maxLength={10}
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            {/* Address Line 1 */}
            <div>
                <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                    Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Write address here"
                    value={formData.addressLine1}
                    onChange={(e) => onChange('addressLine1', e.target.value)}
                    disabled={disabled}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
            </div>

            {/* Address Line 2 */}
            <div>
                <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                    Address Line 2
                </label>
                <input
                    type="text"
                    placeholder="Write address here (Optional)"
                    value={formData.addressLine2}
                    onChange={(e) => onChange('addressLine2', e.target.value)}
                    disabled={disabled}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>

            {/* State and District Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                        State <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={formData.state}
                            onChange={(e) => onChange('state', e.target.value)}
                            disabled={disabled}
                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-500 text-xs sm:text-sm appearance-none focus:outline-none focus:border-gray-300 focus:bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select State</option>
                            {(statesData as any).states.map((state: any) => (
                                <option key={state.state} value={state.state}>
                                    {state.state}
                                </option>
                            ))}
                        </select>
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                        District <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={formData.district}
                            onChange={(e) => onChange('district', e.target.value)}
                            disabled={!formData.state || disabled}
                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-500 text-xs sm:text-sm appearance-none focus:outline-none focus:border-gray-300 focus:bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select District</option>
                            {availableDistricts.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                        {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pincode */}
            <div>
                <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                    Pincode <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={formData.pincode}
                    onChange={(e) => onChange('pincode', e.target.value)}
                    disabled={disabled}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    maxLength={6}
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>

            {/* Save As */}
            <div>
                <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-2 sm:mb-3">
                    Save as
                </label>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {(['Home', 'Office', 'Other'] as AddressType[]).map((type) => (
                        <label key={type} className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="saveAs"
                                value={type}
                                checked={formData.saveAs === type}
                                onChange={(e) => onChange('saveAs', e.target.value)}
                                disabled={disabled}
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 border-gray-300 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-700">{type}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};
