export interface Entity {
  id: number;
  categoryId: number;
  appType: string;

  name: string;
  description: string;

  price: number;
  stock: number;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  category?: {
    id: number;
    name: string;
  };

  images?: {
    id: number;
    imageUrl: string;
    sortOrder: number;
  }[];
}

export interface PaginatedResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  data: T[];
}
