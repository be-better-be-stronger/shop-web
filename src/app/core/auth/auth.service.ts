import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { AuthResponse, LoginRequest, JwtPayload } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiBaseUrl + '/auth';
  private readonly TOKEN_KEY = 'accessToken';

  readonly token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  readonly isAuthed = computed(() => !!this.token());

  readonly payload = computed<JwtPayload | null>(() => {
    const t = this.token();
    return t ? this.decodeJwt(t) : null;
  });

  readonly role = computed(() => (this.payload()?.role ?? '').toUpperCase());
  readonly isAdmin = computed(() => this.role() === 'ADMIN');

  constructor(private http: HttpClient) {}

  login(req: LoginRequest) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.api}/login`, req)
      .pipe(
        map(res => res.data),
        tap(data => {
          if (!data?.token) throw new Error('Login OK nhưng BE không trả token');
          localStorage.setItem(this.TOKEN_KEY, data.token);
          this.token.set(data.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.token.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  isTokenExpired(): boolean {
    const p = this.payload();
    if (!p?.exp) return false; // nếu BE không set exp thì coi như không check
    const nowSec = Math.floor(Date.now() / 1000);
    return p.exp <= nowSec;
  }

  private decodeJwt(token: string): JwtPayload {
    // JWT = header.payload.signature ; payload là base64url
    const parts = token.split('.');
    if (parts.length < 2) return {};

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    try {
      return JSON.parse(json) as JwtPayload;
    } catch {
      return {};
    }
  }
}
