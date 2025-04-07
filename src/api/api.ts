import { store } from "@/store/store";
import axios from "axios";
import { refreshToken } from "./authApi";

export const api = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.get("auth/refresh", {
          withCredentials: true,
        });
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Обработка ошибки (выход пользователя)
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Пропускаем обновление токена для запросов на login и refresh
//     const isLoginRequest = originalRequest.url.includes("/auth/login");
//     const isRefreshRequest = originalRequest.url.includes("/auth/refresh");

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !isLoginRequest && // Не пытаемся обновить токен для login
//       !isRefreshRequest // Не пытаемся обновить токен для refresh
//     ) {
//       originalRequest._retry = true;
//       try {
//         const response = await refreshToken();
//         const newAccessToken = response.accessToken; // Убедимся, что получаем accessToken из ответа
//         store.dispatch({
//           type: "auth/refreshToken/fulfilled",
//           payload: newAccessToken,
//         });
//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         store.dispatch({ type: "auth/clearAuth" });
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
