import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createGame, fetchGame } from "../api/gameApi"; // Импортируем напрямую
import {
  initSocket,
  joinGame,
  onGameUpdate,
  onMoveMade,
  disconnectSocket,
} from "@/api/socketManager";
import GameSetup from "../components/GameSetup/GameSetup";
// import GameBoard from "../components/GameBoard";
import GameBoard from "../components/GameBoard/GameBoard";
import CardSelectionScreen from "../components/CardSelectionScreen/CardSelectionScreen";
import { RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  Game,
  GameState,
  PlayArea,
  Player,
  SelectedPlayArea,
  WizardPropertyToken,
} from "@/hooks/types";

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [gameStarted, setGameStarted] = useState(false);
  const [setupCompleted, setSetupCompleted] = useState(false);
  const [socketGameState, setSocketGameState] = useState<GameState>(null);
  const [game, setGame] = useState<Game>(null); // Локальное состояние для игры
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();

  const currentPlayer = socketGameState?.players.find(
    (player) => player.id === socketGameState.currentPlayer
  );

  useEffect(() => {
    if (!gameId || !user || !accessToken) {
      navigate(
        `/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
      return;
    }

    // Инициализируем сокет
    initSocket();

    // Присоединяемся к игре
    joinGame(gameId, user.id.toString());

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
      fetchGame(accessToken, +gameId)
        .then((fetchedGame) => {
          setGame(fetchedGame);
          setSocketGameState(fetchedGame.gameState);
        })
        .catch((error) => {
          console.error("Ошибка при создании игры:", error);
          navigate(
            `/login?redirect=${encodeURIComponent(
              location.pathname + location.search
            )}`
          );
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
          (player: Player) => player.selectionCompleted
        )
      ) {
        setGameStarted(true);
        setSetupCompleted(true);
      }
    } else if (game) {
      if (
        game.gameState.status === "active" &&
        game.gameState.players.every(
          (player: Player) => player.selectionCompleted
        )
      ) {
        setGameStarted(true);
        setSetupCompleted(true);
      }
    }
  }, [socketGameState]);

  const handleCardSelectionComplete = async (items: {
    property: WizardPropertyToken;
    familiar: Card;
    playerArea: PlayArea;
  }) => {
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5001/game/${gameId}/select-cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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
      setError("Не удалось отправить выбор. Попробуйте снова.");
    }
  };

  if (!gameId || !user) {
    navigate(
      `/login?redirect=${encodeURIComponent(
        location.pathname + location.search
      )}`
    );
    return null;
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {error ? (
          <div className="glass-panel p-10 w-full max-w-4xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">
              Ошибка
            </h2>
            <p className="text-white/60 text-center">{error}</p>
          </div>
        ) : (
          "Загрузка..."
        )}
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 glass-panel p-4 text-red-500">
          {error}
        </div>
      )}
      {gameStarted ? (
        // <GameBoard
        //   game={game}
        //   socketGameState={socketGameState}
        //   setSocketGameState={setSocketGameState}
        // />
        <GameBoard
          game={game}
          gameState={socketGameState}
          players={socketGameState.players}
          currentPlayerId={currentPlayer?.id}
        />
      ) : setupCompleted ? (
        <CardSelectionScreen
          onComplete={handleCardSelectionComplete}
          socketGameState={socketGameState}
        />
      ) : (
        <GameSetup onStartGame={() => setSetupCompleted(true)} />
      )}
    </div>
  );
};

export default GamePage;
