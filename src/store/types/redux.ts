import { GameStateData } from "@/features/game/gameSlice";

// Определение RootState без зависимости от store
export interface RootState {
  auth: {
    user: { id: string; accessToken: string } | null;
  };
  game: {
    currentGame: {
      id: number;
      players: { id: number; username: string }[];
      gameState: GameStateData;
      currentTurn: number;
      currentTurnIndex: number;
    } | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
}
