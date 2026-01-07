import {authTokenAxios} from "./axios";
import {PurchaseRequestPayloadTypes} from "./types";
export const getAllDaan = () => authTokenAxios.get(`/daan`);

export const getDaanDetailsById = (id: string) => authTokenAxios.get(`/daan/${id}`);

export const getPlots = () => authTokenAxios.get(`/plots`);

export const PurchaseDaanRequest = (payload: PurchaseRequestPayloadTypes) => {
  console.log(payload);
  return authTokenAxios.post("/purchase-requests", payload);
};

export const getMyDonations = (page: number = 1, limit: number = 10) =>
  authTokenAxios.get(`/donations/my-donation`, {params: {page, limit}});
