export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export interface Order {
  id: number;

  orderNumber: string;

  totalAmount: number;

  status: OrderStatus;
}
