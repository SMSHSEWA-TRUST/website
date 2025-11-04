import { authTokenAxios } from "./axios";

export const getFeature = () => authTokenAxios.get(`/feature`);