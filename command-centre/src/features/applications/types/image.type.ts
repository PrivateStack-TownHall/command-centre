import type { Entity } from "./entity.type";

export interface Image {
  id: number;

  productId: number;
  product: Entity[];
  imageUrl: string;
  sortOrder: number;

  createdAt?: string;
}
