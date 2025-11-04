import { authTokenAxios } from "./axios";

export interface PoojaItem {
  _id: string;
  id: number;
  name: string;
  price: number;
  image?: string;
  images?: string[]; // API returns images as array
  description?: string;
  whatsInBox?: string;
  itemsIncluded?: string[]; // API returns itemsIncluded as array
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

export interface PoojaResponse {
  success: boolean;
  count: number;
  data: PoojaItem[];
}

export interface SinglePoojaResponse {
  success: boolean;
  data: PoojaItem;
}

export const getPooja = (): Promise<PoojaResponse> => authTokenAxios.get(`/pooja/`);

export const getPoojaById = (poojaId: string): Promise<SinglePoojaResponse> => 
  authTokenAxios.get(`/pooja/${poojaId}`);

export interface BasicDetails {
  name: string;
  gotra: string;
  nakshatra: string;
  sankalp: string;
  noOfMembers: number;
  wantPrasadDelivery: boolean;
  personalizedMessage: string;
}

export interface ContactDetails {
  email: string;
  mobileNumber: string;
  alternateMobileNumber: string;
  address: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface BookPoojaPayload {
  pujaType: string;
  bookingId: string;
  pujaDate: string;
  timeSlot: TimeSlot;
  specialInstructions: string;
  members: number;
  includesPrasad: boolean;
  status: string;
  amount: number;
  paymentStatus: string;
  basicDetails: BasicDetails;
  contactDetails: ContactDetails;
}

export interface BookPoojaResponse {
  success: boolean;
  message: string;
  data: any;
}

export const bookPooja = (payload: BookPoojaPayload): Promise<BookPoojaResponse> => 
  authTokenAxios.post(`/pooja/book-pooja`, payload);

// Booking history types & helper
export interface PoojaBooking {
  id: string;
  bookingId: string;
  name: string;
  mobileNo: string;
  email: string;
  pujaType: string;
  amount: string;
  time: string;
  date: string;
  paymentMode: string;
  paymentStatus: string;
  [key: string]: any;
}

export interface PoojaBookingHistoryResponse {
  success: boolean;
  data: PoojaBooking[];
  message?: string;
}

export const getPoojaHistory = (): Promise<PoojaBookingHistoryResponse> =>
  authTokenAxios.get(`/pooja/get-pooja-history`);

export const cancelPooja = (id: string): Promise<any> => 
  authTokenAxios.put(`/pooja/cancel-pooja?id=${id}`);
