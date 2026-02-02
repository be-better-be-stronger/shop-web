import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { PageProductRequest, ProductResponse, ProductStatusFilter, UpsertProductRequest } from '../../../core/models/product';
import { Page } from '../../../core/models/page.model';

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
      .patch<ApiResponse<void>>(`${this.api}/${id}/disable`, {})
      .pipe(map(() => undefined));
  }

  enable(id: number): Observable<void> {
    return this.http
      .patch<ApiResponse<void>>(`${this.api}/${id}/enable`, {})
      .pipe(map(() => undefined));
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiResponse<string>>(`${this.api}/upload-image`, formData)
      .pipe(map(r => r.data));
  }

  list(
    req: PageProductRequest,
    status?: ProductStatusFilter
  ): Observable<Page<ProductResponse>> {

    const statusParam =
      status === 'active' ? true :
        status === 'disabled' ? false :
          undefined;

    const q = req.q?.trim();
    const sort = req.sort ?? undefined;
    const dir = req.dir ?? undefined;
    const cat = req.cat ?? undefined;

    const params: Record<string, any> = {
      page: req.page,
      size: req.size,
      ...(q ? { q } : {}),
      ...(cat != null ? { cat } : {}),
      ...(sort ? { sort } : {}),
      ...(dir ? { dir } : {}),
      ...(statusParam !== undefined ? { status: String(statusParam) } : {}),
    };

    return this.http.get<any>(this.api, { params: params as any }).pipe(
      map(res => res.data as Page<ProductResponse>)
    );
  }









}
