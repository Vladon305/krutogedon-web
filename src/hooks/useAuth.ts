import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  loginUser,
  registerUser,
  logoutAsync,
  refreshTokenAsync,
} from "../features/auth/authSlice";
import { AppDispatch } from "../store/store";
import { useMemo } from "react";

interface AuthHook {
  user: { id: number; username: string; email: string } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifying: boolean; // Добавляем isVerifying
  error: string | null;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuth = (): AuthHook => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, accessToken, status, error, isVerifying } = useSelector(
    (state: RootState) => state.auth
  );

  const isAuthenticated = useMemo(
    () => !!user && !!accessToken,
    [user, accessToken]
  );
  const isLoading = status === "loading";

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
    } catch (err) {
      throw new Error(err.message || "Failed to register");
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      await dispatch(loginUser({ identifier, password })).unwrap();
    } catch (err) {
      throw new Error(err.message || "Failed to login");
    }
  };

  const handleLogout = async () => {
    if (accessToken) {
      await dispatch(logoutAsync(accessToken)).unwrap();
    }
  };

  const handleRefreshToken = async () => {
    try {
      await dispatch(refreshTokenAsync()).unwrap();
    } catch (err) {
      throw new Error(err.message || "Failed to refresh token");
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isVerifying, // Добавляем в возвращаемые значения
    error,
    register,
    login,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
  };
};
