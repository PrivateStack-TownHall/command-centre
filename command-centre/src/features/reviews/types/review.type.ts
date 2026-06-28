export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt?: string;

  product?: {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
  };
}
