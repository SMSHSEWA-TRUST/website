import { authTokenAxios } from "./axios";

export type LoginPayload = {
  phone: string;
};

// Login endpoint - matches other service patterns
export const Login = (payload: LoginPayload) => authTokenAxios.post(`/user/login`, payload);

export default {
  Login,
};
