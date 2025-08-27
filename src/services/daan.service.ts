import {authTokenAxios} from "./axios";
export const getAllDaan = () => authTokenAxios.get(`/daan`);
export const getDaanDetailsById = (id: string) => authTokenAxios.get(`/daan/${id}`);
export const getPlots = () => authTokenAxios.get(`/plots`);
