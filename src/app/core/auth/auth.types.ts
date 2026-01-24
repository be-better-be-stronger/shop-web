export type LoginRequest = { email: string; password: string };
export type AuthResponse = { token: string };
export type JwtPayload = { email?: string; role?: string; exp?: number; uid?: number };
