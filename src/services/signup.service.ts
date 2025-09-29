import { authTokenAxios } from "./axios";

export type SignupPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
  familyDetails?: any;
  isFamilyDetailsAdded?: boolean;
  [key: string]: any;
};

export const Register = (payload: SignupPayload) => authTokenAxios.post(`/user/register`, payload);

export default {
  Register,
};
