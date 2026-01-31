export interface ProductResponse {
  id: number;
  name: string;
  stock: number;
  price: number;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  imageUrl?: string | null;
}

export interface UpsertProductRequest {
  name: string;
  stock: number;
  price: number;
  categoryId: number;
  isActive?: boolean | null;
  imageUrl?: string | null;
  description: string | null;
}

