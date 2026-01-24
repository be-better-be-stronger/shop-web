import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Category } from "../../models/category";
import { ApiResponse } from "../../models/api-response";

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly api = environment.apiBaseUrl + '/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.api)
    .pipe(map(res => res.data));
  }
}