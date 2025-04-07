import { Card, Game, PlayArea, WizardPropertyToken } from "@/hooks/types";
import { api } from "./api";

export const createGame = async (
  token: string,
  invitationId: number
): Promise<Game> => {
  const response = await api.post(
    "/game/create",
    { invitationId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const fetchGame = async (
  token: string,
  gameId: number
): Promise<Game> => {
  const response = await api.get(`/game/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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

// Добавляем метод для получения опций выбора
export const fetchSelectionOptions = async (
  token: string,
  gameId: number,
  playerId: string
): Promise<{
  properties: WizardPropertyToken[];
  familiars: Card[];
  playerAreas: PlayArea[];
}> => {
  const response = await api.get(
    `/game/${gameId}/selection-options/${playerId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const cancelAttackTarget = async (
  token: string,
  gameId: number,
  playerId: number
) => {
  const response = await api.post(
    `/game/${gameId}/cancelAttackTargetSelection`,
    { playerId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
export const selectAttackTarget = async (
  token: string,
  gameId: number,
  playerId: number,
  opponentId: number
) => {
  const response = await api.post(
    `/game/${gameId}/resolveAttackTarget`,
    { playerId, opponentId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
export const destroyCard = async (
  token: string,
  gameId: number,
  playerId: number,
  cardId: number
) => {
  const response = await api.post(
    `/game/${gameId}/destroyCard`,
    { playerId, cardId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
export const topDeckSelection = async (
  token: string,
  gameId: number,
  {
    playerId,
    cardId,
    action,
  }: {
    playerId: number;
    cardId: number;
    action: string;
  }
) => {
  const response = await api.post(
    `/game/${gameId}/topDeckSelection`,
    { playerId, cardId, action },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const resolveDefense = async (
  accessToken: string,
  gameId: string,
  opponentId: string,
  defenseCardId?: number
) => {
  const response = await api.post(
    `/game/${gameId}/resolve-defense`,
    { opponentId, defenseCardId },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};
