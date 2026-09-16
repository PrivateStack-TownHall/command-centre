export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt?: string;

  user?: {
    id: number;
    email: string;
    fullName: string;
  };

  product?: {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
  };
}
