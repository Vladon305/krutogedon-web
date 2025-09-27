import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLobby,
  joinLobbyByToken,
  setReadyStatus,
  updateLobby,
} from "@/features/lobby/lobbySlice";
import {
  initSocket,
  joinLobby,
  onLobbyUpdate,
  onGameStarted,
  disconnectSocket,
} from "@/api/socketManager";
import { RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Users, User, UserPlus, Play, Loader2, Crown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import styles from "./Lobby.module.scss";

const Lobby: React.FC = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const { accessToken } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const lobby = useSelector((state: RootState) => state.lobby);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const hasJoinedRef = useRef(false);
  const hasJoinedLobbyRef = useRef(false);

  useEffect(() => {
    if (!invitationId || !accessToken || !user) {
      navigate(
        `/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const inviteToken = searchParams.get("token");

    const socket = initSocket();
    socket.on("connect", () => {
      console.log(`Socket connected: ${socket.id}`);
    });

    socket.on("joinedLobby", (message) => {
      console.log(`Received joinedLobby: ${message}`);
    });

    if (!hasJoinedLobbyRef.current) {
      hasJoinedLobbyRef.current = true;
      joinLobby(invitationId);
    }

    if (inviteToken && !hasJoinedRef.current) {
      hasJoinedRef.current = true;
      dispatch(
        joinLobbyByToken({
          token: accessToken,
          inviteToken,
        }) as any
      )
        .then((action: any) => {
          if (
            action.payload &&
            action.payload.status === "accepted" &&
            action.payload.gameId
          ) {
            navigate(`/game/${action.payload.gameId}`);
          } else {
            dispatch(
              fetchLobby({
                token: accessToken,
                invitationId: +invitationId,
              }) as any
            );
          }
        })
        .catch((error: any) => {
          toast.error(error.message || "Не удалось присоединиться к лобби");
          navigate("/");
        });
    } else {
      dispatch(
        fetchLobby({
          token: accessToken,
          invitationId: +invitationId,
        }) as any
      )
        .then((action: any) => {
          if (
            action.payload &&
            action.payload.invitation.status === "accepted" &&
            action.payload.invitation.gameId
          ) {
            navigate(`/game/${action.payload.invitation.gameId}`);
          }
        })
        .catch((error: any) => {
          toast.error(error.message || "Не удалось загрузить лобби");
          navigate("/");
        });
    }

    onLobbyUpdate((updatedLobby) => {
      dispatch(updateLobby(updatedLobby));
    });

    onGameStarted((data) => {
      console.log("data on gameStart", data);
      navigate(`/game/${data.gameId}`);
    });

    return () => {
      disconnectSocket();
    };
  }, [invitationId, user, accessToken, dispatch, navigate, location.search]);

  useEffect(() => {
    if (lobby.players && user?.id) {
      const currentPlayer = lobby.players.find((p: any) => p.id === user.id);
      if (currentPlayer) {
        setIsReady(currentPlayer.ready);
      }
    }
  }, [lobby.players, user]);

  const handleSetReady = () => {
    if (!invitationId || !accessToken || !user?.id) return;

    if (lobby.players.length < 2) {
      toast.info(
        "Для начала игры нужно минимум 2 игрока. Ожидаем других игроков..."
      );
      return;
    }

    dispatch(
      setReadyStatus({
        token: accessToken,
        invitationId: +invitationId,
        userId: user.id,
      }) as any
    );
  };

  if (!user) {
    navigate(
      `/login?redirect=${encodeURIComponent(
        location.pathname + location.search
      )}`
    );
    return null;
  }

  if (lobby.status === "loading") {
    return (
      <div className={styles.lobby__loading}>
        <Loader2 className={styles.lobby__loadingIcon} />
        <p className={styles.lobby__loadingText}>Загрузка лобби...</p>
      </div>
    );
  }

  if (lobby.status === "failed" || !lobby.invitation) {
    return (
      <div className={styles.lobby__error}>
        <p className={styles.lobby__errorText}>Ошибка: {lobby.error}</p>
        <Button variant="outline" className={styles.lobby__homeButton}>
          <Link to={"/"}>Вернуться на главную</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className={styles.lobby}>
      <CardHeader className={styles.lobby__header}>
        <div className={styles.lobby__headerContent}>
          <CardTitle className={styles.lobby__title}>
            <Users className={styles.lobby__titleIcon} />
            Лобби игры #{lobby.invitation.id}
          </CardTitle>
          <Badge variant="outline" className={styles.lobby__playerCount}>
            {lobby.players.length}/5 игроков
          </Badge>
        </div>
        <CardDescription className={styles.lobby__description}>
          Создатель: {lobby.invitation?.sender?.username}
        </CardDescription>
      </CardHeader>

      <CardContent className={styles.lobby__content}>
        <div className={styles.lobby__playersSection}>
          <div>
            <h3 className={styles.lobby__playersTitle}>
              <User className={styles.lobby__playersIcon} />
              Игроки:
            </h3>
            <div className={styles.lobby__playersList}>
              {lobby.players.map((player, index) => (
                <div key={player.id} className={styles.lobby__player}>
                  <Avatar className={styles.lobby__playerAvatar}>
                    <AvatarImage src={player.avatar} alt={player.username} />
                    <AvatarFallback>
                      {player.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={styles.lobby__playerInfo}>
                    <div className={styles.lobby__playerName}>
                      {player.username}{" "}
                      {player.ready ? "✅ Готов" : "⏳ Ожидание"}
                      {index === 0 && (
                        <Crown className={styles.lobby__creatorIcon} />
                      )}
                    </div>
                    <div className={styles.lobby__playerRole}>
                      {index === 0 ? "Создатель" : "Участник"}
                    </div>
                  </div>
                </div>
              ))}

              {lobby.players.length < 5 && (
                <div className={styles.lobby__emptySlot}>
                  <UserPlus className={styles.lobby__emptySlotIcon} />
                  <span>Ожидание игроков...</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.lobby__progressSection}>
            <h3 className={styles.lobby__progressTitle}>
              Прогресс наполнения лобби:
            </h3>
            <Progress
              value={(lobby.players.length / 5) * 100}
              className={styles.lobby__progressBar}
            />
            <p className={styles.lobby__progressText}>
              {lobby.players.length < 2
                ? "Нужно минимум 2 игрока чтобы начать игру"
                : lobby.players.length === 5
                ? "Лобби заполнено! Можно начинать игру"
                : `${5 - lobby.players.length} мест свободно`}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className={styles.lobby__footer}>
        <Button variant="outline" className={styles.lobby__inviteButton}>
          Пригласить еще
        </Button>

        {/* {isCreator && ( */}
        <Button
          onClick={handleSetReady}
          disabled={lobby.players.length < 2}
          className={styles.lobby__readyButton}
        >
          {/* {startingGame ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Начинаем...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Начать игру
              </>
            )} */}
          <>
            <Play className={styles.lobby__readyIcon} />
            Готово
            {/* Начать игру */}
          </>
        </Button>
        {/* )} */}
      </CardFooter>
    </Card>
  );
};

export default Lobby;
