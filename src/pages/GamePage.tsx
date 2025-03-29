import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createGame } from "../api/gameApi"; // Импортируем напрямую
import {
  initSocket,
  joinGame,
  onGameUpdate,
  onMoveMade,
  disconnectSocket,
} from "@/api/socketManager";
import GameSetup from "../components/GameSetup";
import GameBoard from "../components/GameBoard";
import CardSelectionScreen from "../components/CardSelectionScreen";
import { Card } from "../types/game";
import { RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [gameStarted, setGameStarted] = useState(false);
  const [setupCompleted, setSetupCompleted] = useState(false);
  const [socketGameState, setSocketGameState] = useState<any>(null);
  const [game, setGame] = useState<any>(null); // Локальное состояние для игры
  const { accessToken } = useAuth();
  useEffect(() => {
    if (!gameId || !user || (!user.accessToken && !accessToken)) {
      navigate("/login");
      return;
    }

    // Инициализируем сокет
    initSocket();

    // Присоединяемся к игре
    joinGame(gameId);

    // Подписываемся на обновления состояния игры
    onGameUpdate((updatedGameState) => {
      setSocketGameState(updatedGameState);
    });

    // Подписываемся на событие хода
    onMoveMade((data) => {
      setSocketGameState(data);
    });

    // Загружаем игру напрямую через API
    if (!game) {
      createGame(user.accessToken || accessToken, +gameId)
        .then((fetchedGame) => {
          setGame(fetchedGame);
        })
        .catch((error) => {
          console.error("Ошибка при создании игры:", error);
          navigate("/login");
        });
    }

    // Очистка при размонтировании
    return () => {
      disconnectSocket();
    };
  }, [gameId, user, navigate]);

  useEffect(() => {
    if (socketGameState) {
      // Проверяем, завершён ли выбор карт
      if (
        socketGameState.status === "active" &&
        socketGameState.players.every(
          (player: any) => player.selectionCompleted
        )
      ) {
        setGameStarted(true);
        setSetupCompleted(true);
      }
    }
  }, [socketGameState]);

  const handleCardSelectionComplete = async (items: {
    property: Card;
    familiar: Card;
    playerArea: Card;
  }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/game/${gameId}/select-cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
          },
          body: JSON.stringify({
            playerId: user?.id,
            selectedCards: items,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка при выборе карт: " + response.statusText);
      }
    } catch (error) {
      console.error("Ошибка при выборе карт:", error);
    }
  };

  if (!gameId || !user) {
    console.log("nav 1");
    navigate("/login");
    return null;
  }

  if (!socketGameState || !game) {
    console.log(socketGameState, game);
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-hidden">
      {gameStarted ? (
        <GameBoard game={game} socketGameState={socketGameState} />
      ) : setupCompleted ? (
        <CardSelectionScreen onComplete={handleCardSelectionComplete} />
      ) : (
        <GameSetup onStartGame={() => setSetupCompleted(true)} />
      )}
    </div>
  );
};

export default GamePage;
