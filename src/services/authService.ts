import axios from "axios";
import type { LoginData, RegisterData, AuthResponse } from "../types/auth";

// URL till backend API (nu hårdkodad, men kan flyttas till .env)
const API_URL = `${import.meta.env.VITE_API_URL}/auth`; // Ändra detta sen när jag har prodsatt backend

// Registrerar ny användare
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const resp = await axios.post(`${API_URL}/register`, data);
  return resp.data;
};

// Loggar in användare
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const resp = await axios.post(`${API_URL}/login`, data);
  return resp.data;
};