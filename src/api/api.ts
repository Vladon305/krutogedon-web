import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});

// Функция для установки store после его инициализации
let storeInstance: any = null;

export const setApiStore = (store: any) => {
  storeInstance = store;
};

// Добавляем токен к каждому запросу
api.interceptors.request.use(
  (config) => {
    if (storeInstance) {
      const state = storeInstance.getState();
      const token = state.auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Обрабатываем 401 ошибки
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Пропускаем для login и refresh endpoints
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Используем правильный instance api
        const { data } = await api.post('/auth/refresh');
        
        // Обновляем токен в store
        if (storeInstance) {
          storeInstance.dispatch({
            type: 'auth/setAccessToken',
            payload: data.accessToken,
          });
        }
        
        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Если refresh failed - разлогиниваем
        if (storeInstance) {
          storeInstance.dispatch({ type: 'auth/clearAuth' });
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
