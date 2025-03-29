import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createGame, makeMove } from "../../api/gameApi";

// Определяем тип для gameState (на основе вашего предыдущего кода)
interface Card {
  id: number;
  name: string;
  cost: number;
  attack: number;
  life: number;
  effect: string;
  properties: string[];
  damage: number;
  isAttack: boolean;
  type?: "property" | "familiar" | "playerArea";
}

interface Player {
  id: number;
  userId: string;
  username: string;
  deck: Card[];
  hand: Card[];
  discard: Card[];
  life: number;
  power: number;
  krutagidonCups: number;
  deadWizardTokens: number;
  playArea: Card[];
  selectionCompleted: boolean;
}

export interface GameStateData {
  players: Player[];
  currentPlayer: number;
  turn: number;
  status: "pending" | "active" | "finished";
  winner?: Player;
  marketplace: Card[];
  legendaryMarketplace: Card[];
  gameOver: boolean;
}

export interface Game {
  id: number;
  players: { id: number; username: string }[];
  gameState: GameStateData; // Заменяем any на конкретный тип
  currentTurn: number;
  currentTurnIndex: number;
}

export interface GameState {
  currentGame: Game | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GameState = {
  currentGame: null,
  status: "idle",
  error: null,
};

// Тип для ThunkAPI, чтобы получить доступ к состоянию
interface ThunkAPI {
  dispatch: any;
  getState: () => { auth: { user: { id: string } | null } };
}

export const createGameAsync = createAsyncThunk(
  "game/create",
  async ({ token, invitationId }: { token: string; invitationId: number }) => {
    const game = await createGame(token, invitationId);
    return game;
  }
);

export const makeMoveAsync = createAsyncThunk(
  "game/makeMove",
  async ({
    token,
    gameId,
    move,
  }: {
    token: string;
    gameId: number;
    move: any;
  }) => {
    const game = await makeMove(token, gameId, move);
    return game;
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateGameState: (state, action) => {
      state.currentGame = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGameAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createGameAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentGame = action.payload;
        // Подключаемся к WebSocket (предполагается, что это делается в SocketProvider)
      })
      .addCase(createGameAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create game";
      })
      .addCase(makeMoveAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(makeMoveAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentGame = action.payload;
        // Отправка хода через WebSocket должна быть в SocketProvider
      })
      .addCase(makeMoveAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to make move";
      });
  },
});

export const { updateGameState } = gameSlice.actions;
export default gameSlice.reducer;
