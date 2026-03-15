export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  username: string;
}