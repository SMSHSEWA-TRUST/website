import { authTokenAxios } from "./axios";

export interface AddToCartRequest {
  prasad: string;
  quantity: number;
  amount: number;
}

export interface UpdateCartRequest {
  action: 'add' | 'remove' | 'remove';
  quantity: number;
}

export interface PrasadInCart {
  ratings: {
    average: number;
    count: number;
  };
  _id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  itemsIncluded: string[];
  category: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartItem {
  _id: string;
  prasad: PrasadInCart;
  quantity: number;
  amount: number;
}

export interface CartData {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartCharges {
  deliveryCharges: number;
  serviceFee: number;
  taxes: number;
}

export interface CartPreviewData {
  cart: CartData;
  deliveryAddress: string;
  charges: CartCharges;
  grandTotal: number;
}

export interface AddToCartResponse {
  success: boolean;
  message?: string;
  data?: CartItem;
}

export const addToCart = (data: AddToCartRequest): Promise<AddToCartResponse> =>
  authTokenAxios.post(`/my-cart`, data);

export const updateCartItem = (itemId: string, data: UpdateCartRequest): Promise<AddToCartResponse> =>
  authTokenAxios.put(`/my-cart/${itemId}`, data);

export const getCart = (): Promise<{ success: boolean; data: CartData }> =>
  authTokenAxios.get(`/my-cart`);

export const getCartPreview = (cartId: string): Promise<{ success: boolean; data: CartPreviewData }> =>
  authTokenAxios.get(`/my-cart/preview/${cartId}`);

export const createOrder = (cartId: string): Promise<any> =>
  authTokenAxios.post(`/my-cart/create-order?cartId=${cartId}`);

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const verifyPayment = (data: VerifyPaymentRequest): Promise<any> =>
  authTokenAxios.post(`/my-cart/verify-payment`, data);
