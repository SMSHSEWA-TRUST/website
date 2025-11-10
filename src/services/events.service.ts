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

export const getEvents = (templeType?: string, todayDate?: string) => {
  const params: Record<string, string> = {};
  
  if (templeType) {
    params.schedulePlace = templeType;
  }
  
  if (todayDate) {
    params.todayDate = todayDate;
  }
  
  return authTokenAxios.get(`/events`, { params });
};
