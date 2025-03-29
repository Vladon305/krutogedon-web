import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { acceptInvitationByTokenAsync } from "../features/invitations/invitationsSlice";
import { RootState } from "../store/store";

const AcceptInvitation: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inviteToken = params.get("token");
    if (token && inviteToken) {
      dispatch(acceptInvitationByTokenAsync({ token, inviteToken }) as any);
    }
  }, [token, location, dispatch]);

  return (
    <div>
      <h2>Принятие приглашения</h2>
      {token ? (
        <p>Приглашение обрабатывается...</p>
      ) : (
        <p>Пожалуйста, войдите в систему, чтобы принять приглашение.</p>
      )}
    </div>
  );
};

export default AcceptInvitation;
