import { authTokenAxios } from './axios';

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

// Check if user has added family details
export const checkFamilyDetailsStatus = async (userId: string) => {
  try {
    const response = await authTokenAxios.get(`/user/puja-family/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error checking family details status:', error);
    throw error;
  }
};

// Add/Update family details for a user
export const updateFamilyDetails = async (userId: string, payload: FamilyDetailsPayload) => {
  try {
    const response = await authTokenAxios.post(`/user/puja-family/${userId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error updating family details:', error);
    throw error;
  }
};

export default {
  checkFamilyDetailsStatus,
  updateFamilyDetails,
};