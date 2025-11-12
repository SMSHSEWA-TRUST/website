// Utility for persisting and retrieving donation form data across navigation

const STORAGE_KEY_PREFIX = 'donation_form_';

export interface DonationFormState {
  // Form field values
  donationDocId?: string;
  daanType?: string;
  name?: string;
  fatherName?: string;
  motherName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  amount?: number;
  
  // Bhumi Daan specific data
  selectedPlots?: any[];
  plotContacts?: Record<string, any>;
  sameDetailsForAll?: boolean;
  expandedPlots?: Record<string, boolean>;
  plotIds?: any[];
  
  // Additional amount from user input
  userPickedAmount?: number | null;
  
  // Selected payment method
  selectedPaymentMethod?: string | null;
  
  // Flow step
  flowStep?: 'form' | 'selectPayment' | 'paymentDetails';
  
  // Selected Daan Type ID (for Bhojan Daan and others)
  selectedDaanTypeId?: string | null;
  
  // Timestamp for cache expiration
  timestamp?: number;
}

// Cache expiration time: 1 hour
const CACHE_EXPIRATION_MS = 60 * 60 * 1000;

/**
 * Get storage key for a specific donation category
 */
const getStorageKey = (categoryId: string): string => {
  return `${STORAGE_KEY_PREFIX}${categoryId}`;
};

/**
 * Save donation form state to sessionStorage
 */
export const saveDonationFormState = (categoryId: string, state: DonationFormState): void => {
  try {
    const stateWithTimestamp: DonationFormState = {
      ...state,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(getStorageKey(categoryId), JSON.stringify(stateWithTimestamp));
  } catch (error) {
    console.warn('Failed to save donation form state:', error);
  }
};

/**
 * Retrieve donation form state from sessionStorage
 */
export const getDonationFormState = (categoryId: string): DonationFormState | null => {
  try {
    const stored = sessionStorage.getItem(getStorageKey(categoryId));
    if (!stored) return null;
    
    const state: DonationFormState = JSON.parse(stored);
    
    // Check if cache has expired
    if (state.timestamp && Date.now() - state.timestamp > CACHE_EXPIRATION_MS) {
      clearDonationFormState(categoryId);
      return null;
    }
    
    return state;
  } catch (error) {
    console.warn('Failed to retrieve donation form state:', error);
    return null;
  }
};

/**
 * Clear donation form state from sessionStorage
 */
export const clearDonationFormState = (categoryId: string): void => {
  try {
    sessionStorage.removeItem(getStorageKey(categoryId));
  } catch (error) {
    console.warn('Failed to clear donation form state:', error);
  }
};

/**
 * Clear all donation form states from sessionStorage
 */
export const clearAllDonationFormStates = (): void => {
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear all donation form states:', error);
  }
};
