// Prashad Order History API integration
export interface PrashadOrderHistoryResponse {
  success: boolean;
  data: any[];
  message?: string;
}

export const getPrasadOrderHistory = (): Promise<PrashadOrderHistoryResponse> =>
  authTokenAxios.get("/prasad/history");
import { authTokenAxios } from "./axios";

export interface PrasadItem {
  _id: string;
  id: number;
  name: string;
  price: number;
  image?: string;
  images?: string[]; // API returns images as array
  description?: string;
  whatsInBox?: string;
  itemsIncluded?: Array<{
    itemName: string;
    itemImage?: string;
    itemDescription?: string;
    _id?: string;
  }>; // API returns itemsIncluded as array of objects
  gallery?: string[];
  category?: string;
  stock?: number;
  isAvailable?: boolean;
  ratings?: {
    average: number;
    count: number;
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  [key: string]: any;
}

export interface PrasadResponse {
  success: boolean;
  count: number;
  data: PrasadItem[];
}

export interface SinglePrasadResponse {
  success: boolean;
  data: PrasadItem;
}

export const getPrasad = (): Promise<PrasadResponse> => authTokenAxios.get(`/prasad/`);

export const getPrasadById = (prasadId: string): Promise<SinglePrasadResponse> => 
  authTokenAxios.get(`/prasad/${prasadId}`);

// Fetch prasad items by tag (e.g. "best sellers").
export const getPrasadByTag = (tag: string): Promise<PrasadResponse> =>
  authTokenAxios.get(`/prasad/get-by-tag?tag=${encodeURIComponent(tag)}`);
