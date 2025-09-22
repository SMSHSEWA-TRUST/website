import { authTokenAxios } from '../services/axios';

export interface FamilyMember {
  name: string;
  relation: string;
}

export interface FamilyDetails {
  gotra?: string | null;
  nakshatra?: string | null;
  sankalp?: string | null;
  members: FamilyMember[];
}

export interface FamilyDetailsPayload {
  familyDetails: FamilyDetails;
  isFamilyDetailsAdded: boolean;
}

// Family Details API Functions
export const checkFamilyDetailsStatus = async (userId: string) => {
  try {
    const response = await authTokenAxios.get(`/user/puja-family/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error checking family details status:', error);
    throw error;
  }
};

export const updateFamilyDetails = async (userId: string, payload: FamilyDetailsPayload) => {
  try {
    const response = await authTokenAxios.post(`/user/puja-family/${userId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error updating family details:', error);
    throw error;
  }
};

// Family Utils Functions
export const shouldShowFamilyDetails = (userData: any): boolean => {
  return !userData?.isFamilyDetailsAdded;
};

export const getUserFromStorage = () => {
  try {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

export const updateUserInStorage = (updates: any) => {
  try {
    const existingUser = getUserFromStorage();
    const updatedUser = { ...existingUser, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error("Error updating user in localStorage:", error);
    return null;
  }
};

export default {
  checkFamilyDetailsStatus,
  updateFamilyDetails,
  shouldShowFamilyDetails,
  getUserFromStorage,
  updateUserInStorage,
};