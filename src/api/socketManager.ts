import { GameStateData } from "@/features/game/gameSlice";
import { Card, GameState } from "@/hooks/types";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5001", { withCredentials: true });
    console.log("Initializing socket...");
  }
  return socket;
};

export const joinGame = (gameId: string, playerId: string) => {
  if (socket) {
    socket.emit("joinGame", { gameId, playerId });
    console.log(
      `Emitting joinGame for gameId: ${gameId} playerId: ${playerId}`
    );
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

export const joinLobby = (lobbyId: string) => {
  if (socket) {
    console.log("lobbyId", lobbyId);
    socket.emit("joinLobby", { lobbyId });
    console.log(`Emitting joinLobby for lobbyId: ${lobbyId}`);
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

export const makeMove = (gameId: number, userId: string, move: any) => {
  if (socket) {
    socket.emit("makeMove", { gameId, userId, move });
    console.log(`Emitting makeMove: gameId=${gameId}, userId=${userId}`);
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

export const onGameUpdate = (callback: (gameState: GameState) => void) => {
  if (socket) {
    socket.on("gameUpdate", (updatedGameState: GameState) => {
      console.log("Received gameUpdate:", updatedGameState);
      callback(updatedGameState);
    });

    return () => {
      socket?.off("gameUpdate", callback);
      console.log("Unsubscribed from gameUpdate");
    };
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
    return () => {};
  }
};

export const onLegendaryCardRevealed = (
  callback: (gameState: GameState) => void
) => {
  if (socket) {
    socket.on("legendaryCardRevealed", (card) => {
      console.log("Legendary card revealed:", card);
      callback(card);
    });
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

export const onMoveMade = (callback: (gameState: GameState) => void) => {
  if (socket) {
    socket.on("moveMade", (data: GameState) => {
      console.log("Received moveMade:", data);
      callback(data);
    });
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

export const onLobbyUpdate = (callback: (lobby: any) => void) => {
  if (socket) {
    socket.on("lobbyUpdate", (updatedLobby: any) => {
      console.log("Socket received lobbyUpdate:", updatedLobby);
      callback(updatedLobby);
    });
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

export const onGameStarted = (callback: (data: { gameId: string }) => void) => {
  if (socket) {
    socket.on("gameStarted", (data: { gameId: string }) => {
      console.log("Received gameStarted:", data);
      callback(data);
    });
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

// Добавляем новые методы для обработки событий выбора
export const onSelectionRequired = (
  callback: (data: { playerId: string; data: any }) => void
) => {
  if (socket) {
    socket.on("selectionRequired", (data: { playerId: string; data: any }) => {
      console.log("Received selectionRequired:", data);
      callback(data);
    });
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

export const onAttackRequired = (
  callback: (data: { playerId: string; data: any }) => void
) => {
  if (socket) {
    socket.on("attackRequired", (data) => {
      console.log("Received attackRequired:", data);
      callback(data);
    });
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

export const onAttackTargetRequired = (
  callback: (data: { playerId: string; data: any }) => void
) => {
  if (socket) {
    socket.on("attackTargetRequired", callback);
    console.log("Subscribed to attackTargetRequired");

    // Возвращаем функцию для отписки
    return () => {
      socket?.off("attackTargetRequired", callback);
      console.log("Unsubscribed from attackTargetRequired");
    };
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
    return () => {};
  }
};

export const onAttackTargetNotification = (
  callback: (data: { playerId: string; cardId: number }) => void
) => {
  if (socket) {
    socket.on("attackTargetNotification", callback);
    console.log("Subscribed to attackTargetNotification");

    // Возвращаем функцию для отписки
    return () => {
      socket?.off("attackTargetNotification", callback);
      console.log("Unsubscribed from attackTargetNotification");
    };
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
    return () => {};
  }
};

export const onSelectionUpdated = (
  callback: (data: { playerId: string; selection: any }) => void
) => {
  if (socket) {
    socket.on(
      "selectionUpdated",
      (data: { playerId: string; selection: any }) => {
        console.log("Received selectionUpdated:", data);
        callback(data);
      }
    );
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

// Новые методы для обработки событий атаки и защиты
export const onDefenseRequired = (
  callback: (data: {
    gameId: string;
    attackData: {
      attackerId: number;
      opponentId: number;
      cardId: number;
      damage: number;
    };
  }) => void
) => {
  if (socket) {
    socket.on("defenseRequired", callback);
    console.log("Subscribed to defenseRequired");

    return () => {
      socket?.off("defenseRequired", callback);
      console.log("Unsubscribed from defenseRequired");
    };
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
    return () => {};
  }
};

export const onAttackNotification = (
  callback: (data: {
    attackerId: string;
    opponentId: string;
    cardId: number;
    damage: number;
  }) => void
) => {
  if (socket) {
    socket.on("attackNotification", callback);
    console.log("Subscribed to attackNotification");

    return () => {
      socket?.off("attackNotification", callback);
      console.log("Unsubscribed from attackNotification");
    };
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
    return () => {};
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting socket...");
    socket.disconnect();
    socket = null;
  }
};
