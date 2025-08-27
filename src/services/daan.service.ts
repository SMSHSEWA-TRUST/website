import {authTokenAxios} from "./axios";
import {PurchaseRequestPayloadTypes} from "./types";
export const getAllDaan = () => authTokenAxios.get(`/daan`);

export const getDaanDetailsById = (id: string) => authTokenAxios.get(`/daan/${id}`);

export const getPlots = () => authTokenAxios.get(`/plots`);

export const PurchaseDaanRequest = (payload: PurchaseRequestPayloadTypes) =>
  authTokenAxios.post("/purchase-requests", payload);
