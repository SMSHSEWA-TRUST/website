import { authTokenAxios } from "./axios";

export type Subscription = {
  id: number | string;
  email?: string;
  name?: string;
  createdAt?: string;
  [key: string]: any;
};


export const getAllSubscriptions = () => authTokenAxios.get(`/api/subscriptions/`);

export default {
  getAllSubscriptions,
};
