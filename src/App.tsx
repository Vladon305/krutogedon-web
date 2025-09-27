import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GamePage from "./pages/GamePage";
import RulesPage from "./pages/RulesPage";
import { SocketProvider } from "./hooks/useSocket";
import HandDemoPage from "./pages/HandDemoPage";
import { GameProvider } from "./context/GameContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InvitePage from "./pages/InvitePage";
import Lobby from "./components/Lobby/Lobby";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useEffect } from "react";
import {
  clearAuth,
  refreshTokenAsync,
  setVerifying,
  verifyTokenAsync,
} from "./features/auth/authSlice";
import Game from "./pages/Game";
import { useTypedDispatch } from "./hooks/useTypedDispatch";
import { useTypedSelector } from "./hooks/useTypedSelector";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const AppContent = () => {
  const dispatch = useTypedDispatch();
  const { isAuthenticated } = useAuth();
  const { accessToken, isVerifying } = useTypedSelector((state) => state.auth);

  useEffect(() => {
    const restoreAuth = async () => {
      // Проверяем токен только если он есть
      if (accessToken && !isVerifying) {
        dispatch(setVerifying(true));
        try {
          await dispatch(verifyTokenAsync(accessToken) as any).unwrap();
        } catch (error) {
          // Токен невалидный, пробуем обновить
          try {
            await dispatch(refreshTokenAsync() as any).unwrap();
          } catch (refreshError) {
            console.log("Failed to refresh token:", refreshError);
            dispatch(clearAuth());
          }
        } finally {
          dispatch(setVerifying(false));
        }
      }
    };

    restoreAuth();
  }, []);

  if (isVerifying) {
    return <div>Проверка авторизации...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/game"
          element={
            // <ProtectedRoute>
            <GamePage />
            /* </ProtectedRoute> */
          }
        />
        <Route
          path="/game/:gameId"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
        <Route path="/rules" element={<RulesPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/invite"
          element={
            <ProtectedRoute>
              <InvitePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lobby/:invitationId"
          element={
            <ProtectedRoute>
              <Lobby />
            </ProtectedRoute>
          }
        />

        <Route path="/hand-demo" element={<HandDemoPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Provider store={store}>
          <PersistGate loading={<div>Загрузка...</div>} persistor={persistor}>
            <SocketProvider>
              <GameProvider>
                <AppContent />
              </GameProvider>
            </SocketProvider>
          </PersistGate>
        </Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
