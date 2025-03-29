import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LobbyState {
  invitation: any;
  players: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LobbyState = {
  invitation: null,
  players: [],
  status: "idle",
  error: null,
};

export const fetchLobby = createAsyncThunk(
  "lobby/fetchLobby",
  async ({ token, invitationId }: { token: string; invitationId: number }) => {
    const response = await axios.get(
      `http://localhost:5001/invitations/lobby/${invitationId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

export const joinLobbyByToken = createAsyncThunk(
  "lobby/joinLobbyByToken",
  async ({ token, inviteToken }: { token: string; inviteToken: string }) => {
    const response = await axios.get(
      `http://localhost:5001/invitations/join-by-token?token=${inviteToken}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

export const setReadyStatus = createAsyncThunk(
  "lobby/setReadyStatus",
  async (
    {
      token,
      invitationId,
      userId,
    }: { token: string; invitationId: number; userId: number },
    { dispatch }
  ) => {
    const response = await axios.post(
      `http://localhost:5001/invitations/set-ready`,
      { invitationId, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // После успешного вызова setReadyStatus вызываем fetchLobby, чтобы обновить данные
    dispatch(fetchLobby({ token, invitationId }));
    return response.data;
  }
);

const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    updateLobby(state, action) {
      state.invitation = action.payload.invitation;
      state.players = action.payload.players; // Обновляем список игроков
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLobby.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLobby.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invitation = action.payload.invitation;
        state.players = action.payload.players;
        state.error = null;
      })
      .addCase(fetchLobby.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lobby";
      })
      .addCase(joinLobbyByToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(joinLobbyByToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invitation = action.payload;
        state.error = null;
      })
      .addCase(joinLobbyByToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to join lobby";
      })
      .addCase(setReadyStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setReadyStatus.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(setReadyStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to set ready status";
      });
  },
});

export const { updateLobby } = lobbySlice.actions;
export default lobbySlice.reducer;
