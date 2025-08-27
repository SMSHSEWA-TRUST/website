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
}
