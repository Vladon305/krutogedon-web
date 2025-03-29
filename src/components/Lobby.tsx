import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLobby,
  joinLobbyByToken,
  setReadyStatus,
  updateLobby,
} from "../features/lobby/lobbySlice";
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
    if (!invitationId || (!user?.accessToken && !accessToken) || !user) {
      navigate("/login");
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
          token: user.accessToken || accessToken,
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
                token: user.accessToken || accessToken,
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
          token: user.accessToken || accessToken,
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
    if (!invitationId || (!user?.accessToken && !accessToken) || !user?.id)
      return;

    if (lobby.players.length < 2) {
      toast.info(
        "Для начала игры нужно минимум 2 игрока. Ожидаем других игроков..."
      );
      return;
    }

    dispatch(
      setReadyStatus({
        token: user.accessToken || accessToken,
        invitationId: +invitationId,
        userId: user.id,
      }) as any
    );
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (lobby.status === "loading") {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Загрузка лобби...</p>
      </div>
    );
  }

  if (lobby.status === "failed" || !lobby.invitation) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-4">
        <p className="text-destructive mb-2">Ошибка: {lobby.error}</p>
        <Button variant="outline">
          <Link to={"/"}>Вернуться на главную</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg overflow-hidden">
      <CardHeader className="space-y-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Лобби игры #{lobby.invitation.id}
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {lobby.players.length}/5 игроков
          </Badge>
        </div>
        <CardDescription className="text-white/80">
          Создатель: {lobby.invitation?.sender?.username}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Игроки:
            </h3>
            <div className="space-y-3">
              {lobby.players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center p-3 rounded-md transition-colors bg-secondary/10 hover:bg-secondary/20"
                >
                  <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage src={player.avatar} alt={player.username} />
                    <AvatarFallback>
                      {player.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="font-medium flex items-center">
                      {player.username}{" "}
                      {player.ready ? "✅ Готов" : "⏳ Ожидание"}
                      {index === 0 && (
                        <Crown className="w-4 h-4 ml-1 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {index === 0 ? "Создатель" : "Участник"}
                    </div>
                  </div>
                </div>
              ))}

              {lobby.players.length < 5 && (
                <div className="flex items-center p-3 rounded-md border-2 border-dashed border-muted-foreground/30 text-muted-foreground justify-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  <span>Ожидание игроков...</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Прогресс наполнения лобби:</h3>
            <Progress
              value={(lobby.players.length / 5) * 100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground text-center">
              {lobby.players.length < 2
                ? "Нужно минимум 2 игрока чтобы начать игру"
                : lobby.players.length === 5
                ? "Лобби заполнено! Можно начинать игру"
                : `${5 - lobby.players.length} мест свободно`}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-6 flex justify-between flex-wrap gap-3">
        <Button variant="outline">Пригласить еще</Button>

        {/* {isCreator && ( */}
        <Button
          onClick={handleSetReady}
          disabled={lobby.players.length < 2}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
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
            <Play className="mr-2 h-4 w-4" />
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
