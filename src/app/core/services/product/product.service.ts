import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/api-response';
import { ProductResponse, UpsertProductRequest } from '../../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = environment.apiBaseUrl + '/admin/products';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<string> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http
      .post<ApiResponse<string>>(`${this.api}/upload-image`, fd)
      .pipe(map(res => res.data));
  }

  create(req: UpsertProductRequest): Observable<ProductResponse> {
    return this.http
      .post<ApiResponse<ProductResponse>>(this.api, req)
      .pipe(map(res => res.data));
  }

  update(id: number, req: UpsertProductRequest): Observable<ProductResponse> {
    return this.http
      .put<ApiResponse<ProductResponse>>(`${this.api}/${id}`, req)
      .pipe(map(res => res.data));
  }
}
