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
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RootState, store, persistor } from "./store/store";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InvitePage from "./pages/InvitePage";
import Lobby from "./components/Lobby";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import {
  clearAuth,
  refreshTokenAsync,
  setVerifying,
  verifyTokenAsync,
} from "./features/auth/authSlice";
import Game from "./pages/Game";

const queryClient = new QueryClient();

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken, refreshToken, isVerifying } =
    useSelector((state: RootState) => state.auth);

  // useEffect(() => {
  //   const restoreAuth = async () => {
  //     if (accessToken && !isAuthenticated) {
  //       dispatch(setVerifying(true));
  //       try {
  //         await dispatch(verifyTokenAsync(accessToken) as any).unwrap();
  //       } catch (error) {
  //         if (refreshToken) {
  //           try {
  //             await dispatch(refreshTokenAsync() as any).unwrap();
  //           } catch (refreshError) {
  //             console.log("Failed to refresh token:", refreshError);
  //             dispatch(clearAuth());
  //           }
  //         } else {
  //           dispatch(clearAuth());
  //         }
  //       } finally {
  //         dispatch(setVerifying(false));
  //       }
  //     }
  //   };

  //   restoreAuth();
  // }, [dispatch, accessToken, refreshToken, isAuthenticated]);

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
        <PersistGate loading={<div>Загрузка...</div>} persistor={persistor}>
          <Provider store={store}>
            <SocketProvider>
              <GameProvider>
                <AppContent />
              </GameProvider>
            </SocketProvider>
          </Provider>
        </PersistGate>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
