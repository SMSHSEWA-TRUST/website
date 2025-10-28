import { authTokenAxios } from './axios';

export interface ChargeItem {
  _id: string;
  location?: string;
  deliveryCharges: number;
  serviceFee: number;
  taxes: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ChargeResponse {
  success: boolean;
  count: number;
  data: ChargeItem[];
}

export const getPrasadCharge = (prasadId: string) =>
  authTokenAxios.get<ChargeResponse>(`/charge?id=${prasadId}`);

export default {
  getPrasadCharge,
};