export interface Product {
  id: number;
  name: string;
  price: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;

  productName: string;

  price: string;
  quantity: number;
  subtotal: string;

  createdAt: string;

  product: Product;
}

export interface Payment {
  id: number;
  orderId: number;

  amount: string;

  method: "BANK_TRANSFER" | "EWALLET" | "CASH";

  status: "PENDING" | "SUCCESS" | "FAILED";

  paidAt: string | null;

  createdAt: string;
}

export interface OrderHistory {
  id: number;
  orderId: number;

  status: "PENDING" | "PAID" | "PROCESSING" | "COMPLETED" | "CANCELLED";

  notes: string | null;

  createdAt: string;
}

export interface OrderUser {
  id: number;
  fullName: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

export interface Order {
  id: number;
  userId: number;

  orderNumber: string;

  totalAmount: string;

  status: "PENDING" | "PAID" | "PROCESSING" | "COMPLETED" | "CANCELLED";

  createdAt: string;
  updatedAt: string;

  user: OrderUser;

  items: OrderItem[];

  payments: Payment[];

  histories: OrderHistory[];
}
