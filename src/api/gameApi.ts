import { api } from "./api";

export const createGame = async (token: string, invitationId: number) => {
  const response = await api.post(
    "/game/create",
    { invitationId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const makeMove = async (token: string, gameId: number, move: any) => {
  const response = await api.post(
    "/game/move",
    { gameId, move },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getLobby = async (token: string, invitationId: number) => {
  const response = await api.get(`/game/lobby/${invitationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
