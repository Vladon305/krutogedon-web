import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { setApiStore } from "../api/api";

import authReducer from "../features/auth/authSlice";
import invitationsReducer from "../features/invitations/invitationsSlice";
import gameReducer from "../features/game/gameSlice";
import lobbyReducer from "../features/lobby/lobbySlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const secretKey = import.meta.env.VITE_PERSIST_SECRET_KEY;

if (!secretKey) {
  throw new Error("PERSIST_SECRET_KEY is not defined in .env file");
}

const encryptor = encryptTransform({
  secretKey,
  onError: (error) => {
    console.error("Encryption error:", error);
  },
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: [encryptor], // Добавляем шифрование
};

const rootReducer = combineReducers({
  auth: authReducer,
  invitations: invitationsReducer,
  game: gameReducer,
  lobby: lobbyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Инициализируем store в api.ts после его создания
setApiStore(store);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
