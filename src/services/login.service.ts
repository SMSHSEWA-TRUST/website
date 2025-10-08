import { authTokenAxios } from "./axios";

export type LoginPayload = {
  phone: string;
};

// Login endpoint - matches other service patterns
export const Login = (payload: LoginPayload, skipErrorToast = false) => {
  const config = skipErrorToast ? { skipErrorToast: true } as any : {};
  return authTokenAxios.post(`/user/login`, payload, config);
};

export default {
  Login,
};
