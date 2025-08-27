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
      console.log("Unauthorized");
      localStorage.clear();
    }
    return Promise.reject(error);
  }
);
