import { authTokenAxios } from "./axios";

// Get user profile
export const getUserProfile = () => {
  return authTokenAxios.get(`/user/profile`);
};

// Update user profile
export type UpdateProfilePayload = {
  name?: string;
  email?: string;
  phone?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
};

export const updateUserProfile = (payload: UpdateProfilePayload) => {
  return authTokenAxios.patch(`/user/update-profile/`, payload);
};

// Address types
export type AddressType = "Home" | "Office" | "Other";

export type AddressPayload = {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  type: AddressType;
  isPreferred?: boolean;
  isActive?: boolean;
};

export type AddressModel = {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  type: AddressType;
  isPreferred: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Get all addresses for a user
export const getUserAddresses = () => {
  return authTokenAxios.get(`/user-address`);
};

// Add a new address
export const addUserAddress = (payload: AddressPayload) => {
  return authTokenAxios.post(`/user-address`, payload);
};

// Update an existing address
export const updateUserAddress = (addressId: string, payload: AddressPayload) => {
  return authTokenAxios.put(`/user-address/${addressId}`, payload);
};

// Delete an address
export const deleteUserAddress = (addressId: string) => {
  return authTokenAxios.delete(`/user-address/${addressId}`);
};

// Set preferred address
export const setPreferredAddress = (addressId: string) => {
  return authTokenAxios.patch(`/user-address/${addressId}/preferred`);
};

export default {
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setPreferredAddress,
};
