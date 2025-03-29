import { GameStateData } from "@/features/game/gameSlice";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5001", { withCredentials: true });
    console.log("Initializing socket...");
  }
  return socket;
};

export const joinGame = (gameId: string) => {
  if (socket) {
    socket.emit("joinGame", gameId);
    console.log(`Emitting joinGame for gameId: ${gameId}`);
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

export const joinLobby = (lobbyId: string) => {
  if (socket) {
    socket.emit("joinLobby", lobbyId);
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

export const onGameUpdate = (callback: (gameState: GameStateData) => void) => {
  if (socket) {
    socket.on("gameUpdate", (updatedGameState: GameStateData) => {
      console.log("Received gameUpdate:", updatedGameState);
      callback(updatedGameState);
    });
  } else {
    console.error("Socket is not initialized. Call initSocket first.");
  }
};

export const onMoveMade = (callback: (gameState: GameStateData) => void) => {
  if (socket) {
    socket.on("moveMade", (data: GameStateData) => {
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

export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting socket...");
    socket.disconnect();
    socket = null;
  }
};
