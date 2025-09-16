import { authTokenAxios } from "./axios";

export interface EventItem {
  id?: string;
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  image?: string;
  imageUrl?: string;
  [key: string]: any;
}

export const getEvents = () => authTokenAxios.get(`/events`);
