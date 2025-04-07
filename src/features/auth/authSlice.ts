import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  verifyToken,
  refreshToken,
  logout as logoutApi,
} from "../../api/authApi";

export interface AuthState {
  user: {
    id: number;
    username: string;
    email: string;
  } | null;
  refreshToken: string;
  accessToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isVerifying: boolean; // Добавляем флаг для отслеживания проверки
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
  isVerifying: false,
};

export const verifyTokenAsync = createAsyncThunk(
  "auth/verifyToken",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const user = await verifyToken(accessToken);
      return { user, accessToken };
    } catch (error) {
      return rejectWithValue("Invalid token");
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshToken();
      return response.accessToken;
    } catch (error) {
      return rejectWithValue("Failed to refresh token");
    }
  }
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      await logoutApi(accessToken);
      return true;
    } catch (error) {
      return rejectWithValue("Failed to logout");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await register(username, email, password);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) => {
    const response = await login(identifier, password);
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
      state.error = null;
      state.isVerifying = false;
    },
    setVerifying: (state, action) => {
      state.isVerifying = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyTokenAsync.pending, (state) => {
        state.status = "loading";
        state.isVerifying = true;
      })
      .addCase(verifyTokenAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isVerifying = false;
      })
      .addCase(verifyTokenAsync.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.accessToken = null;
        state.error = action.payload as string;
        state.isVerifying = false;
      })
      .addCase(refreshTokenAsync.pending, (state) => {
        state.status = "loading";
        state.isVerifying = true;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload;
        state.isVerifying = false;
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.accessToken = null;
        state.error = action.payload as string;
        state.isVerifying = false;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = "idle";
        state.error = null;
        state.isVerifying = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to register";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        console.log("action.payload", action.payload);
        state.refreshToken = action.payload.user.refreshToken;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to login";
      });
  },
});

export const { clearAuth, setVerifying } = authSlice.actions;
export default authSlice.reducer;
