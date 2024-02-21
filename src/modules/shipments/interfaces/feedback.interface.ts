export interface Feedback {
  _id?: string;
  userId: string;
  shipmentId: string;
  rating: number;
  comment?: string;
}
