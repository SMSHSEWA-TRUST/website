import { authTokenAxios } from "./axios";

export interface Person {
  name: string;
  designation?: string | null;
  imageUrl?: string | null;
}

export interface TestimonialItem {
  person: Person;
  _id: string;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  isCarousel?: boolean;
  rating?: number;
  isActive?: boolean;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TestimonialResponse {
  data: TestimonialItem[];
}

export const getTestimonials = () => authTokenAxios.get<TestimonialResponse>("/testimonial/");