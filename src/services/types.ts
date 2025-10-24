export interface PurchaseRequestPayloadTypes {
  daanId: string;
  totalAmount: number | string;
  name: string;
  fatherName: string;
  motherName: string;
  addressDetails: string;
  email: string;
  phoneNumber: number | string;
  plotIds?: any;
  paymentMode?: string;
  daanType?: string; // Selected donation type ID from the checkbox/radio selection
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DonationApiResponse {
  success: boolean;
  message: string;
  count: number;
  data: any[];
  pagination: PaginationResponse;
}
