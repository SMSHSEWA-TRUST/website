import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const authTokenAxios = axios.create({
  baseURL: BASE_URL,
});
const token = localStorage.getItem("authToken");
if (token) {
  authTokenAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
authTokenAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
authTokenAxios.interceptors.response.use(
  response => {
    const method = response?.config?.method?.toLowerCase();
    if (method === "post" && response?.data?.success) {
      toast.success(response?.data?.message);
    }
    return response?.data;
  },
  async error => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
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
        console.log(refreshResponseError);
      }
    }
    toast.error(error?.response?.data?.message ?? "Something went wrong");
    return Promise.reject(error);
  }
);
