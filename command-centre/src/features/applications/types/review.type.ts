import type { Entity } from "./entity.type";

export interface Review {
  id: number;

  userId: number;
  productId: number;

  rating: number;
  comment?: string;

  createdAt?: string;

  user: {
    id: number;
    email: string;
    fullName: string;
  };

  product: Entity;
}
