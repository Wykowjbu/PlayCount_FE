export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  user: LoginUser;
}

export interface LoginUser {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
