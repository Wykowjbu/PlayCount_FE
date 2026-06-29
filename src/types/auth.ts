export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType?: string;
  expiresAt?: string;
  user?: LoginUser | null;
}

export interface LoginUser {
  id: number | string;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  role: string;
  status?: string | null;
  isEmailVerified?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
