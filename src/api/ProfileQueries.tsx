import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getUserProfile,
    updateUserProfile,
    UpdateProfilePayload,
    getUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setPreferredAddress,
    AddressPayload
} from "@/services/profile.service";

export const QueryKeys = {
    profile: ["user", "profile"],
    addresses: ["user", "addresses"],
};

// Hook to fetch user profile
export const useGetUserProfile = () => {
    const isLoggedIn = Boolean(localStorage.getItem("authToken"));

    return useQuery({
        queryKey: QueryKeys.profile,
        queryFn: getUserProfile,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: isLoggedIn, // Only fetch profile when user is logged in
    });
};

// Hook to update user profile
export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) =>
            updateUserProfile(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.profile });

            if (data?.data?.user) {
                // Merge with existing stored user if present so we don't drop fields
                const existingUser = localStorage.getItem('user');
                const updatedUser = existingUser
                    ? { ...JSON.parse(existingUser), ...data.data.user }
                    : data.data.user;

                try {
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    // Keep a lightweight `userName` key for quick header access
                    if (updatedUser.name) {
                        localStorage.setItem('userName', updatedUser.name);
                    }

                    // Notify same-window listeners (Header listens for this) so UI updates immediately
                    window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
                } catch (e) {
                    // ignore storage errors
                }
            }
        },
    });
};

// Hook to fetch user addresses
export const useGetUserAddresses = () => {
    const isLoggedIn = Boolean(localStorage.getItem("authToken"));

    return useQuery({
        queryKey: QueryKeys.addresses,
        queryFn: getUserAddresses,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: isLoggedIn, // Only fetch addresses when user is logged in
    });
};

// Hook to add a new address
export const useAddUserAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddressPayload) =>
            addUserAddress(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.addresses });
        },
    });
};

// Hook to update an address
export const useUpdateUserAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ addressId, payload }: { addressId: string; payload: AddressPayload }) =>
            updateUserAddress(addressId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.addresses });
        },
    });
};

// Hook to delete an address
export const useDeleteUserAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (addressId: string) =>
            deleteUserAddress(addressId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.addresses });
        },
    });
};

// Hook to set preferred address
export const useSetPreferredAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (addressId: string) =>
            setPreferredAddress(addressId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.addresses });
        },
    });
};

export default {
    useGetUserProfile,
    useUpdateUserProfile,
    useGetUserAddresses,
    useAddUserAddress,
    useUpdateUserAddress,
    useDeleteUserAddress,
    useSetPreferredAddress,
};
