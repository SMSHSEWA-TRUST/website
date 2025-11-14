import axios from "axios";
import toast from "react-hot-toast";
import { logout } from "./auth";
// Vite env vars are inlined at build time. Provide a safe fallback so
// production builds don't silently fail when `VITE_BASE_URL` is missing.
const BASE_URL = import.meta.env.VITE_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
// Helpful debug output for production troubleshooting — can be removed later.
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.info('[axios] Using BASE_URL =', BASE_URL);
}
// helper to read selected language (fallback to 'en')
const getSelectedLang = () => {
  try {
    return localStorage.getItem("lang") || "en";
  } catch (e) {
    return "en";
  }
};
export const authTokenAxios = axios.create({
  baseURL: BASE_URL,
});
const token = localStorage.getItem("authToken");
if (token) {
  authTokenAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
// set initial Accept-Language header
authTokenAxios.defaults.headers.common["Accept-Language"] = getSelectedLang();
authTokenAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // ensure Accept-Language is included on every request and reflect latest selection
    try {
      const lang = getSelectedLang();
      // normalize headers object
      if (!config.headers) config.headers = {} as any;
      config.headers["Accept-Language"] = lang;
    } catch (e) {
      // ignore
    }
    return config;
  },
  error => Promise.reject(error)
);
authTokenAxios.interceptors.response.use(
  response => {
    const method = response?.config?.method?.toLowerCase();
    // Check if skipToast flag is set in config
    const skipToast = (response?.config as any)?.skipToast;
    if (method === "post" && response?.data?.success && !skipToast) {
      toast.success(response?.data?.message);
    }
    return response?.data;
  },
  async error => {
    const prevRequest = error?.config;
    // allow opt-out for requests that don't want the global refresh/logout behavior
    const skipAutoAuth = prevRequest && (prevRequest.skipAutoAuth || prevRequest.headers?.['x-skip-auto-auth']);
    // If 401 received, try refresh token once. If refresh fails, logout user.
    if (!skipAutoAuth && error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}/user/refresh-token`,
          {
            refreshToken: localStorage.getItem("refreshToken"),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Accept-Language": getSelectedLang(),
            },
          }
        );

        prevRequest.headers["Authorization"] = `Bearer ${refreshResponse?.data?.token}`;
        authTokenAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${refreshResponse?.data?.token}`;

        localStorage.setItem("authToken", refreshResponse?.data?.token);
        localStorage.setItem("refreshToken", refreshResponse?.data?.refreshToken);

        return authTokenAxios(prevRequest);
      } catch (refreshResponseError) {
        // Refresh failed: force logout so session is cleared and user redirected
        console.log('Refresh token failed', refreshResponseError);
        try {
          logout();
        } catch (e) {
          /* ignore */
        }
        return Promise.reject(refreshResponseError);
      }
    }
    // For authorization errors when previous logic doesn't handle it, clear session
    if (!skipAutoAuth && (error?.response?.status === 401 || error?.response?.status === 419)) {
      try {
        logout();
      } catch (e) {
        /* ignore */
      }
    }
    // Check if skipErrorToast flag is set in config
    const skipErrorToast = (error?.config as any)?.skipErrorToast;
    if (!skipErrorToast) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    }
    return Promise.reject(error);
  }
);
