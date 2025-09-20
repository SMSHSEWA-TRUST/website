import { authTokenAxios } from "./axios";

export interface GalleryItem {
  _id?: string;
  title?: string;
  imageUrl?: string;
  createdAt?: string;
  __v?: number;
  [key: string]: any;
}

export interface GalleryResponse {
  success: boolean;
  count: number;
  data: GalleryItem[];
}

export const getGallery = (): Promise<GalleryResponse> => authTokenAxios.get(`/gallery/`);