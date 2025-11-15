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

export const getEvents = (templeType?: string, selectedDate?: string | Date, includeDate: boolean = true) => {
  const params: Record<string, string> = {};
  
  if (templeType) {
    params.schedulePlace = templeType;
  }
  
  // Only include todayDate parameter if explicitly requested (for puja booking)
  if (selectedDate && includeDate) {
    // Format date as YYYY-MM-DD for API
    let dateStr: string;
    if (selectedDate instanceof Date) {
      // Ensure we format in local timezone to avoid timezone offset issues
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    } else {
      dateStr = selectedDate;
    }
    params.todayDate = dateStr;
  }
  
  return authTokenAxios.get(`/events`, { params });
};

// Convenience function for live section - only sends schedulePlace
export const getLiveEvents = (templeType?: string) => {
  const params: Record<string, string> = {};
  if (templeType) params.schedulePlace = templeType;
  // Use the upcoming-events endpoint for live/upcoming events
  return authTokenAxios.get(`/events/upcoming-events`, { params });
};

// Convenience function for puja booking - sends both schedulePlace and todayDate
export const getPujaEvents = (selectedDate?: string | Date, templeType?: string) => {
  return getEvents(templeType, selectedDate, true);
};
