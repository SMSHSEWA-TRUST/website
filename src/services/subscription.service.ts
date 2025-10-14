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
  authTokenAxios.post(`/my-cart/buy-now`, { subscriptionId, amount: amountRupees }, { headers: { 'x-skip-auto-auth': '1' } });

export default {
  getAllSubscriptions,
  getMySubscriptions,
  buyNow,
};
