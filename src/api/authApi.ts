import { api } from "./api";

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const login = async (identifier: string, password: string) => {
  const response = await api.post("/auth/login", { identifier, password });
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const logout = async (token: string) => {
  const response = await api.post(
    "/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const verifyToken = async (token: string) => {
  const response = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
