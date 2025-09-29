import { authTokenAxios } from "./axios";

export type VerifyOtpPayload = {
  phone: string;
  otp: string;
};

export const VerifyOtp = (payload: VerifyOtpPayload) =>
  authTokenAxios.post(`/user/verify-otp`, payload);

export default {
  VerifyOtp,
};
