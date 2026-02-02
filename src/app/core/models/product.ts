export interface ProductResponse {
  id: number;
  name: string;
  stock: number;
  price: number;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  imageUrl?: string | null;
  description?: string | null;
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

export interface PageProductRequest {
  /** 1-based page index */
  page: number;

  /** page size (1–50) */
  size: number;

  /** keyword search (map với BE field q) */
  q?: string;

  /** category id */
  cat?: number;

  /** sort field */
  sort?: 'name' | 'price';

  /** sort direction */
  dir?: 'asc' | 'desc';
}


export type ProductStatusFilter = 'all' | 'active' | 'disabled';
