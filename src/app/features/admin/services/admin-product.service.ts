import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, map, filter } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { ProductResponse, UpsertProductRequest } from '../../../core/models/product';

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private readonly api = `${environment.apiBaseUrl}/admin/products`;

  constructor(private http: HttpClient) {}

  create(req: UpsertProductRequest): Observable<ProductResponse> {
    return this.http.post<ApiResponse<ProductResponse>>(this.api, req).pipe(map(r => r.data));
  }

  update(id: number, req: UpsertProductRequest): Observable<ProductResponse> {
    return this.http.put<ApiResponse<ProductResponse>>(`${this.api}/${id}`, req).pipe(map(r => r.data));
  }

  disable(id: number): Observable<void> {
    return this.http.patch<ApiResponse<null>>(`${this.api}/${id}`, {}).pipe(map(() => void 0));
  }

  /** Option B step 1: upload image -> return imageUrl */
  uploadImage(file: File): Observable<string> {
    const fd = new FormData();
    fd.append('file', file);

    return this.http
      .post<ApiResponse<string>>(`${this.api}/upload-image`, fd)
      .pipe(map(r => r.data));
  }

  /** Optional: upload with progress (UI đẹp hơn) */
  uploadImageWithProgress(file: File): Observable<{ progress: number; url?: string }> {
    const fd = new FormData();
    fd.append('file', file);

    return this.http.post<ApiResponse<string>>(`${this.api}/upload-image`, fd, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      filter((e: HttpEvent<ApiResponse<string>>) =>
        e.type === HttpEventType.UploadProgress || e.type === HttpEventType.Response
      ),
      map((e: HttpEvent<ApiResponse<string>>) => {
        if (e.type === HttpEventType.UploadProgress) {
          const total = e.total ?? 0;
          const progress = total > 0 ? Math.round((100 * e.loaded) / total) : 0;
          return { progress };
        }

        // e.type === Response => e là HttpResponse<ApiResponse<string>>
        const res = e as HttpResponse<ApiResponse<string>>;
        const url = res.body?.data;
        return { progress: 100, url };
      })
    );
  }
}
