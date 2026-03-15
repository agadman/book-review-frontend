import axios from "axios";
import type { LoginData, RegisterData, AuthResponse } from "../types/auth";

const API_URL = "http://localhost:5002/api/auth"; // Ändra detta sen när jag har prodsatt backend

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const resp = await axios.post(`${API_URL}/register`, data);
  return resp.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const resp = await axios.post(`${API_URL}/login`, data);
  return resp.data;
};