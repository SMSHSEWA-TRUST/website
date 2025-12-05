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

    return useMutation<AddToCartResponse, Error, { itemId: string; data: UpdateCartRequest }, { previousCartData: any }>({
        mutationFn: ({ itemId, data }) => updateCartItem(itemId, data),
        onMutate: async ({ itemId, data }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: QueryKeys.getCart });

            // Snapshot the previous value
            const previousCartData = queryClient.getQueryData(QueryKeys.getCart);

            // Optimistically update to the new value
            queryClient.setQueryData(QueryKeys.getCart, (old: any) => {
                if (!old || !old.data) return old;

                const newCartData = JSON.parse(JSON.stringify(old));
                const cartItems = newCartData.data.cart?.items || newCartData.data.items || [];

                const itemIndex = cartItems.findIndex((item: any) => item._id === itemId);
                if (itemIndex > -1) {
                    const item = cartItems[itemIndex];
                    const quantityChange = data.quantity;
                    const action = data.action;

                    let newQuantity = item.quantity;
                    if (action === 'add') {
                        newQuantity += quantityChange;
                    } else if (action === 'remove') {
                        newQuantity -= quantityChange;
                    }

                    if (newQuantity <= 0) {
                        // Remove item
                        cartItems.splice(itemIndex, 1);
                    } else {
                        // Update quantity
                        item.quantity = newQuantity;
                    }
                }

                return newCartData;
            });

            // Return a context object with the snapshotted value
            return { previousCartData };
        },
        onError: (err, newTodo, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousCartData) {
                queryClient.setQueryData(QueryKeys.getCart, context.previousCartData);
            }
        },
        onSettled: () => {
            // Always refetch after error or success:
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
