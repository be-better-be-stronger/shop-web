export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // 0-based from Spring Page
  first?: boolean;
  last?: boolean;
  empty?: boolean;
  numberOfElements?: number;
}
