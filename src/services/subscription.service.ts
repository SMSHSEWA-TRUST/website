import { authTokenAxios } from "./axios";

export type Subscription = {
  id: number | string;
  email?: string;
  name?: string;
  createdAt?: string;
  [key: string]: any;
};


export const getAllSubscriptions = () => authTokenAxios.get(`/subscriptions/`);


export const buyNow = (subscriptionId: string | number, amountRupees: number) =>
  authTokenAxios.post(`/my-cart/buy-now`, { subscriptionId, amount: amountRupees }, { headers: { 'x-skip-auto-auth': '1' } });

export default {
  getAllSubscriptions,
  buyNow,
};
