// Common address types
export type AddressType = 'Home' | 'Office' | 'Other';

export interface AddressModel {
    _id: string;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    type: AddressType;
    isActive: boolean;
    isPreferred: boolean;
}

export interface AddressFormData {
    name: string;
    email: string;
    mobile: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    district: string;
    pincode: string;
    saveAs: AddressType;
}

export interface AddressPayload {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    type: AddressType;
    isActive: boolean;
    isPreferred: boolean;
}

export interface AddressFormConfig {
    // Whether to show delete button (e.g., in checkout)
    showDeleteButton?: boolean;
    // Custom submit button text
    submitButtonText?: string;
    // Custom title for the modal/form
    title?: string;
    // Whether form is in edit mode
    isEditMode?: boolean;
    // Callback when delete is clicked
    onDelete?: (addressId: string) => Promise<void>;
    // Callback when form is submitted
    onSubmit?: (payload: AddressPayload, addressId?: string) => Promise<void>;
    // Callback when form is cancelled
    onCancel?: () => void;
}

export interface AddressErrors {
    [key: string]: string;
}
