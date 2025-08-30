import axios from "axios";
import { auth } from "../firebase";

/**
 * In sviluppo usiamo il proxy di Vite:
 *  - baseURL = ""  -> le chiamate vanno a /api/... su 5173 e Vite le inoltra all'8080
 * In produzione, usa VITE_API_URL se serve.
 */
const baseURL = import.meta.env.DEV ? "" : (import.meta.env.VITE_API_URL || "");

export const api = axios.create({ baseURL });

// Se usi Firebase Auth, allega il token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});





