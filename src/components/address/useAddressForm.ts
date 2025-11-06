import { useState, useEffect } from 'react';
import statesData from '../../data/states-and-districts.json';
import { AddressFormData, AddressModel, AddressErrors, AddressPayload } from './types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useAddressForm = (initialAddress?: AddressModel | null) => {
    const [addressForm, setAddressForm] = useState<AddressFormData>({
        name: '',
        email: '',
        mobile: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        pincode: '',
        saveAs: 'Home',
    });

    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const [addressErrors, setAddressErrors] = useState<AddressErrors>({});

    // Update districts when state changes
    useEffect(() => {
        if (addressForm.state) {
            const selectedState = (statesData as any).states.find(
                (s: any) => s.state === addressForm.state
            );
            setAvailableDistricts(selectedState?.districts || []);
        } else {
            setAvailableDistricts([]);
        }
    }, [addressForm.state]);

    // Parse address string to form fields
    const parseAddressToForm = (address: AddressModel) => {
        const addressParts = (address.address || '').split(', ');

        let addressLine1 = '';
        let addressLine2 = '';
        let district = '';
        let state = '';
        let pincode = '';

        if (addressParts.length === 4) {
            addressLine1 = addressParts[0] || '';
            district = addressParts[1] || '';
            state = addressParts[2] || '';
            pincode = addressParts[3] || '';
        } else if (addressParts.length >= 5) {
            addressLine1 = addressParts[0] || '';
            addressLine2 = addressParts[1] || '';
            district = addressParts[2] || '';
            state = addressParts[3] || '';
            pincode = addressParts[4] || '';
        }

        setAddressForm({
            name: address.name || '',
            email: address.email || '',
            mobile: address.phoneNumber || '',
            addressLine1,
            addressLine2,
            state,
            district,
            pincode,
            saveAs: address.type || 'Home',
        });

        if (state) {
            const selectedState = (statesData as any).states.find(
                (s: any) => s.state === state
            );
            setAvailableDistricts(selectedState?.districts || []);
        }
    };

    // Load initial address if provided
    useEffect(() => {
        if (initialAddress) {
            parseAddressToForm(initialAddress);
        }
    }, [initialAddress]);

    const handleAddressFormChange = (field: string, value: string) => {
        // Sanitize numeric inputs
        if (field === 'mobile') {
            let digits = String(value || '').replace(/\D/g, '');
            digits = digits.replace(/^0+/, '');
            if (digits.length > 10) digits = digits.slice(0, 10);
            setAddressForm((prev) => ({ ...prev, mobile: digits }));
            setAddressErrors((prev) => ({ ...prev, mobile: '' }));
            return;
        }

        if (field === 'pincode') {
            let digits = String(value || '').replace(/\D/g, '');
            if (digits.length > 6) digits = digits.slice(0, 6);
            setAddressForm((prev) => ({ ...prev, pincode: digits }));
            setAddressErrors((prev) => ({ ...prev, pincode: '' }));
            return;
        }

        // For state change, reset district
        setAddressForm((prev) => ({
            ...prev,
            [field]: value,
            ...(field === 'state' ? { district: '' } : {}),
        }));
        setAddressErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const resetForm = () => {
        setAddressForm({
            name: '',
            email: '',
            mobile: '',
            addressLine1: '',
            addressLine2: '',
            state: '',
            district: '',
            pincode: '',
            saveAs: 'Home',
        });
        setAddressErrors({});
        setAvailableDistricts([]);
    };

    const validateForm = (): boolean => {
        const errors: AddressErrors = {};

        if (!addressForm.name.trim()) {
            errors.name = 'Please enter a name';
        } else if (addressForm.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        const mobile = String(addressForm.mobile || '');
        if (!mobile) {
            errors.mobile = 'Please enter mobile number';
        } else if (!/^\d{10}$/.test(mobile)) {
            errors.mobile = 'Mobile must be 10 digits';
        } else if (/^0/.test(mobile)) {
            errors.mobile = 'Mobile cannot start with 0';
        }

        if (!addressForm.email.trim()) {
            errors.email = 'Please enter an email';
        } else if (!EMAIL_REGEX.test(addressForm.email.trim())) {
            errors.email = 'Invalid email address';
        }

        if (!addressForm.addressLine1.trim()) {
            errors.addressLine1 = 'Please enter address';
        }

        if (!addressForm.state) {
            errors.state = 'Please select state';
        }

        if (!addressForm.district) {
            errors.district = 'Please select district';
        }

        const pincode = String(addressForm.pincode || '');
        if (!pincode) {
            errors.pincode = 'Please enter pincode';
        } else if (!/^\d{6}$/.test(pincode)) {
            errors.pincode = 'Pincode must be 6 digits';
        }

        setAddressErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const buildAddressPayload = (): AddressPayload => {
        const addressParts = [
            addressForm.addressLine1.trim(),
            addressForm.addressLine2.trim() ? addressForm.addressLine2.trim() : null,
            addressForm.district,
            addressForm.state,
            addressForm.pincode,
        ].filter(Boolean);

        const addressString = (addressParts as string[]).join(', ');

        return {
            name: addressForm.name.trim(),
            phoneNumber: addressForm.mobile.trim(),
            email: addressForm.email.trim(),
            address: addressString,
            type: addressForm.saveAs,
            isActive: true,
            isPreferred: false,
        };
    };

    return {
        addressForm,
        availableDistricts,
        addressErrors,
        handleAddressFormChange,
        resetForm,
        validateForm,
        buildAddressPayload,
        parseAddressToForm,
    };
};
