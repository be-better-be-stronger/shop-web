import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from '../models/category';
import { ApiResponse } from '../models/api-response';
import { ProductResponse } from '../models/product';
import { Page } from '../models/page.model';
import { environment } from '../../../environments/environment';

export type ProductSort = 'name' | 'price';
export type SortDir = 'asc' | 'desc';

export interface GetProductsParams {
  page?: number; // 1-based
  size?: number;
  q?: string;
  cat?: number | null;
  sort?: ProductSort;
  dir?: SortDir;
}

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private readonly baseUrl = environment.apiBaseUrl; // proxy -> http://localhost:8080

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/categories`).pipe(
      map(response => response.data)
    );
  }

  getProducts(params: GetProductsParams): Observable<Page<ProductResponse>> {
    let httpParams = new HttpParams();

    const page = params.page ?? 1;
    const size = params.size ?? 10;
    const sort = params.sort ?? 'name';
    const dir = params.dir ?? 'asc';

    httpParams = httpParams.set('page', String(page));
    httpParams = httpParams.set('size', String(size));
    httpParams = httpParams.set('sort', sort);
    httpParams = httpParams.set('dir', dir);

    const q = (params.q ?? '').trim();
    if (q.length > 0) httpParams = httpParams.set('q', q);

    if (params.cat != null) httpParams = httpParams.set('cat', String(params.cat));

    return this.http.get<ApiResponse<Page<ProductResponse>>>(`${this.baseUrl}/products`, {
      params: httpParams,
    }).pipe(map(response => response.data));
  }
}
