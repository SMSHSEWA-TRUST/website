import { authTokenAxios } from "./axios";

export type Subscription = {
  id: number | string;
  email?: string;
  name?: string;
  createdAt?: string;
  [key: string]: any;
};


export const getAllSubscriptions = () => authTokenAxios.get(`/subscriptions/`);

export const getMySubscriptions = (page: number = 1, limit: number = 10) => 
  authTokenAxios.get(`/subscriptions/my-subscriptions`, { params: { page, limit } });

export const buyNow = (subscriptionId: string | number, amountRupees: number) =>
  authTokenAxios.post(`/my-cart/buy-now`, { subscriptionId, amount: amountRupees });

export const verifyPayment = (payload: any) =>
  authTokenAxios.post(`/my-cart/verify-payment`, payload);

export default {
  getAllSubscriptions,
  getMySubscriptions,
  buyNow,
  verifyPayment,
};
