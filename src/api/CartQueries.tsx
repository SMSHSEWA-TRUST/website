import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, getCart, getCartPreview, updateCartItem, createOrder, verifyPayment, AddToCartRequest, AddToCartResponse, UpdateCartRequest, VerifyPaymentRequest } from "@/services/cart.service";

export const QueryKeys = {
    cart: "cart",
    getCart: ["cart", "getCart"],
    getCartPreview: (cartId: string) => ["cart", "getCartPreview", cartId],
};

export const useGetCart = () => {
    const isLoggedIn = Boolean(localStorage.getItem("authToken"));

    return useQuery({
        queryKey: QueryKeys.getCart,
        queryFn: async () => {
            const response = await getCart();
            // If cart data is available, fetch the preview using the cartId
            if (response?.data?._id) {
                return getCartPreview(response.data._id);
            }
            return response;
        },
        enabled: isLoggedIn, // Only fetch cart data when user is logged in
    });
};

export const useGetCartPreview = (cartId?: string) => {
    const isLoggedIn = Boolean(localStorage.getItem("authToken"));

    return useQuery({
        queryKey: cartId ? QueryKeys.getCartPreview(cartId) : ["cart", "getCartPreview"],
        queryFn: () => getCartPreview(cartId!),
        enabled: isLoggedIn && !!cartId, // Only fetch cart data when user is logged in and cartId is available
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation<AddToCartResponse, Error, AddToCartRequest>({
        mutationFn: (data: AddToCartRequest) => addToCart(data),
        onSuccess: () => {
            // Invalidate and refetch cart data after successful addition
            queryClient.invalidateQueries({ queryKey: QueryKeys.getCart });
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation<AddToCartResponse, Error, { itemId: string; data: UpdateCartRequest }>({
        mutationFn: ({ itemId, data }) => updateCartItem(itemId, data),
        onSuccess: () => {
            // Invalidate and refetch cart data after successful update
            queryClient.invalidateQueries({ queryKey: QueryKeys.getCart });
        },
    });
};

export const useCreateOrder = () => {
    return useMutation<any, Error, string | { cartId: string; note?: string; address?: string }>({
        mutationFn: (arg: string | { cartId: string; note?: string; address?: string }) => {
            if (typeof arg === 'string') return createOrder(arg);
            return createOrder(arg.cartId, arg.note, arg.address);
        },
    });
};

export const useVerifyPayment = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, VerifyPaymentRequest>({
        mutationFn: (data: VerifyPaymentRequest) => verifyPayment(data),
        onSuccess: () => {
            // Invalidate and refetch cart data after successful payment verification
            queryClient.invalidateQueries({ queryKey: QueryKeys.getCart });
        },
    });
};
