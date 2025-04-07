import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { accessToken } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !accessToken) {
      navigate(
        `/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
      return;
    }

    // Здесь можно добавить запрос к бэкенду для получения данных игры
    console.log(`Loading game with ID: ${gameId}`);
  }, [gameId, user, accessToken, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold">Игра #{gameId}</h1>
      <p>Добро пожаловать в игру! Здесь будет игровая логика.</p>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => navigate("/")}
      >
        Вернуться на главную
      </button>
    </div>
  );
};

export default Game;
