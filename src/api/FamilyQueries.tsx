import { authTokenAxios } from '../services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

export const updateFamilyDetails = async (userId: string, payload: FamilyDetailsPayload, skipToast = false) => {
  try {
    const response = await authTokenAxios.put(`/user/puja-family/${userId}`, payload, {
      skipToast
    } as any);
    return response.data;
  } catch (error: any) {
    console.error('Error updating family details:', error);
    throw error;
  }
};

// Add a family member
export const addFamilyMember = async (userId: string, member: FamilyMember) => {
  try {
    // Send payload in the nested shape expected by the backend:
    // { familyDetails: { members: [ { action: 'add', name, relation } ] } }
    const payload = {
      familyDetails: {
        members: [
          {
            action: 'add',
            name: member.name,
            relation: member.relation,
          },
        ],
      },
    };

    const response = await authTokenAxios.put(`/user/puja-family/${userId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error adding family member:', error);
    throw error;
  }
};

// Delete a family member
export const deleteFamilyMember = async (userId: string, memberId: string) => {
  try {
    // Send a nested payload so backend can delete an individual member by _id:
    // { familyDetails: { members: [ { action: 'delete', _id: '<memberId>' } ] } }
    const payload = {
      familyDetails: {
        members: [
          {
            action: 'delete',
            _id: memberId,
          },
        ],
      },
    };

    const response = await authTokenAxios.put(`/user/puja-family/${userId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting family member:', error);
    throw error;
  }
};

// React Query Hooks
export const useAddFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, member }: { userId: string; member: FamilyMember }) =>
      addFamilyMember(userId, member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

export const useDeleteFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, memberId }: { userId: string; memberId: string }) =>
      deleteFamilyMember(userId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

// Update family details (generic) - accepts FamilyDetailsPayload
export const useUpdateFamilyDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: FamilyDetailsPayload | any }) =>
      updateFamilyDetails(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
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