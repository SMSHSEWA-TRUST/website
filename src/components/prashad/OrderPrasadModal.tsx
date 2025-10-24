import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '../ui/input';
import statesAndDistricts from '../../data/states-and-districts.json';

interface OrderPrasadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (formData: OrderFormData) => void;
}

export interface OrderFormData {
    name: string;
    email: string;
    mobile: string;
    alternateMobile: string;
    address: string;
    state: string;
    district: string;
    pincode: string;
    deliveryMode: 'standard' | 'express';
}

const OrderPrasadModal: React.FC<OrderPrasadModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<OrderFormData>({
        name: '',
        email: '',
        mobile: '',
        alternateMobile: '',
        address: '',
        state: '',
        district: '',
        pincode: '',
        deliveryMode: 'standard',
    });

    const [districts, setDistricts] = useState<string[]>([]);

    useEffect(() => {
        if (formData.state) {
            const selectedState = statesAndDistricts.states.find(
                (s) => s.state === formData.state
            );
            setDistricts(selectedState?.districts || []);
            setFormData((prev) => ({ ...prev, district: '' }));
        } else {
            setDistricts([]);
        }
    }, [formData.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeliveryModeChange = (mode: 'standard' | 'express') => {
        setFormData((prev) => ({ ...prev, deliveryMode: mode }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
        // You can add validation here
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                    <h2 className="font-secondaryFont text-2xl font-semibold text-gray-900">
                        Order Prasad
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        {/* Name and Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block font-secondaryFont text-sm font-medium text-gray-900 mb-2">
                                    Name <span className="text-red-600">*</span>
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-12 rounded-lg bg-gray-50 border-gray-200 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block font-secondaryFont text-sm font-medium text-gray-900 mb-2">
                                    Email ID
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full h-12 rounded-lg bg-gray-50 border-gray-200 focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Mobile Numbers Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="mobile" className="block font-secondaryFont text-sm font-medium text-gray-900 mb-2">
                                    Mobile No.
                                </label>
                                <Input
                                    id="mobile"
                                    name="mobile"
                                    type="tel"
                                    placeholder="Enter Mobile No."
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    className="w-full h-12 rounded-lg bg-gray-50 border-gray-200 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="alternateMobile" className="block font-secondaryFont text-sm font-medium text-gray-900 mb-2">
                                    Alternate Mobile No.
                                </label>
                                <Input
                                    id="alternateMobile"
                                    name="alternateMobile"
                                    type="tel"
                                    placeholder="Enter Email"
                                    value={formData.alternateMobile}
                                    onChange={handleInputChange}
                                    className="w-full h-12 rounded-lg bg-gray-50 border-gray-200 focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block font-secondaryFont text-sm font-medium text-gray-900 mb-2">
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                placeholder="Enter Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={4}
                                className="flex w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 placeholder:font-normal hover:border-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 resize-none font-secondaryFont"
                            />
                        </div>

                        {/* State and District Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="state" className="block font-secondaryFont text-sm font-medium text-gray-900 mb-2">
                                    State
                                </label>
                                <select
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="flex h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm shadow-sm transition-colors hover:border-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 font-secondaryFont text-gray-900"
                                >
                                    <option value="" className="text-gray-400">Enter State</option>
                                    {statesAndDistricts.states.map((state) => (
                                        <option key={state.state} value={state.state}>
                                            {state.state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="district" className="block font-secondaryFont text-sm font-medium text-gray-900 mb-2">
                                    District
                                </label>
                                <select
                                    id="district"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    disabled={!formData.state}
                                    className="flex h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm shadow-sm transition-colors hover:border-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 font-secondaryFont text-gray-900"
                                >
                                    <option value="" className="text-gray-400">Enter District</option>
                                    {districts.map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Pincode and Delivery Mode Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="pincode" className="block font-secondaryFont text-sm font-medium text-gray-900 mb-2">
                                    Pincode
                                </label>
                                <Input
                                    id="pincode"
                                    name="pincode"
                                    type="text"
                                    placeholder="Enter Pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    maxLength={6}
                                    className="w-full h-12 rounded-lg bg-gray-50 border-gray-200 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block font-secondaryFont text-sm font-medium text-gray-900 mb-2">
                                    Delivery Mode
                                </label>
                                <div className="flex items-center gap-6 h-12">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="deliveryMode"
                                            value="standard"
                                            checked={formData.deliveryMode === 'standard'}
                                            onChange={() => handleDeliveryModeChange('standard')}
                                            className="w-4 h-4 text-[#8b0000] border-gray-300 focus:ring-[#8b0000] focus:ring-2"
                                        />
                                        <span className="ml-2 font-secondaryFont text-sm text-gray-900">
                                            Standard
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="deliveryMode"
                                            value="express"
                                            checked={formData.deliveryMode === 'express'}
                                            onChange={() => handleDeliveryModeChange('express')}
                                            className="w-4 h-4 text-[#8b0000] border-gray-300 focus:ring-[#8b0000] focus:ring-2"
                                        />
                                        <span className="ml-2 font-secondaryFont text-sm text-gray-900">
                                            Express
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            className="w-full bg-[#8b0000] hover:bg-[#660000] text-white font-secondaryFont font-semibold py-3.5 rounded-lg transition-colors shadow-sm"
                        >
                            Continue to Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderPrasadModal;
