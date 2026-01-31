import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { ProductResponse, UpsertProductRequest } from '../../../core/models/product';

@Injectable({ providedIn: 'root' })
export class AdminProductService {

  private http = inject(HttpClient);
  private readonly api = `${environment.apiBaseUrl}/admin/products`;

  create(req: UpsertProductRequest): Observable<ProductResponse> {
    return this.http
      .post<ApiResponse<ProductResponse>>(this.api, req)
      .pipe(map(r => r.data));
  }

  update(id: number, req: UpsertProductRequest): Observable<ProductResponse> {
    return this.http
      .put<ApiResponse<ProductResponse>>(`${this.api}/${id}`, req)
      .pipe(map(r => r.data));
  }

  disable(id: number): Observable<void> {
    return this.http
      .patch<ApiResponse<void>>(`${this.api}/${id}`, {})
      .pipe(map(() => undefined));
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiResponse<string>>(`${this.api}/upload-image`, formData)
      .pipe(map(r => r.data));
  }
}
