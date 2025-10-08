import { Login } from "@/services/login.service";
import { Register } from "@/services/signup.service";
import { VerifyOtp } from "@/services/otp.service";
import { useMutation } from "@tanstack/react-query";

export const QueryKeys = {
    auth: "auth",
    login: ["auth", "login"],
};

export const useLogin = () =>
    useMutation({
        mutationKey: QueryKeys.login,
        mutationFn: (payload: { phone: string; skipErrorToast?: boolean }) =>
            Login({ phone: payload.phone }, payload.skipErrorToast),
    });

export const QueryKeysRegister = {
    register: ["auth", "register"],
};

export const useRegister = () =>
    useMutation({
        mutationKey: QueryKeysRegister.register,
        mutationFn: (payload: any) => Register(payload),
    });

export const QueryKeysOtp = {
    verifyOtp: ["auth", "verifyOtp"],
    resendOtp: ["auth", "resendOtp"],
};

export const useVerifyOtp = () =>
    useMutation({
        mutationKey: QueryKeysOtp.verifyOtp,
        mutationFn: (payload: { phone: string; otp: string }) => VerifyOtp(payload),
    });

// resendOtp uses the same Login service (POST /user/login)
export const useResendOtp = () =>
    useMutation({
        mutationKey: QueryKeysOtp.resendOtp,
        mutationFn: (payload: { phone: string }) => Login(payload),
    });

export default {
    useLogin,
    useRegister,
    useVerifyOtp,
    useResendOtp,
};
