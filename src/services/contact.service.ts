import {authTokenAxios} from "./axios";

export type ContactUSPayload = {
  name: string;
  email: string;
  message: string;
  phone: string;
};

export const ContactUS = (payload: ContactUSPayload) => authTokenAxios.post(`/contact-us`, payload);
