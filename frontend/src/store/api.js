import axios from "axios";

const api = axios.create({
  // Por defecto se usa una ruta relativa: nginx reenvía /api al backend en el mismo origen.
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

// Adjunta el token JWT guardado en localStorage a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("iph_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token expira o es inválido, regresa al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = (error.config?.url || "").includes("/auth/login");
    if (error.response && error.response.status === 401 && !esLogin) {
      localStorage.removeItem("iph_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
