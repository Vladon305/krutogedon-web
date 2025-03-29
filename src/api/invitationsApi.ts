import { api } from "./api";

export const createInvitation = async (token: string) => {
  const response = await api.post(
    "/invitations/create",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const joinLobbyByToken = async (token: string, inviteToken: string) => {
  const response = await api.get(
    `/invitations/join-by-token?token=${inviteToken}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const setReady = async (
  token: string,
  invitationId: number,
  userId: number
) => {
  const response = await api.post(
    `/invitations/ready/${invitationId}`,
    { userId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
