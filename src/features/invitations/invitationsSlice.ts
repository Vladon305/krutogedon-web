import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createInvitation } from "../../api/invitationsApi";

export interface Invitation {
  id: number;
  status: "pending" | "accepted" | "declined";
  lobbyLink?: string;
}

export interface InvitationsState {
  invitations: Invitation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InvitationsState = {
  invitations: [],
  status: "idle",
  error: null,
};

export const createInvitationAsync = createAsyncThunk(
  "invitations/create",
  async ({ token }: { token: string }) => {
    const invitation = await createInvitation(token);
    return invitation;
  }
);

const invitationsSlice = createSlice({
  name: "invitations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInvitationAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createInvitationAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invitations.push(action.payload);
      })
      .addCase(createInvitationAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create invitation";
      });
  },
});

export default invitationsSlice.reducer;
