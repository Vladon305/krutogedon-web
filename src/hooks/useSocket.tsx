import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { GameStateData, updateGameState } from "../features/game/gameSlice"; // Импортируем тип
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/types/redux";

interface SocketContextType {
  socket: Socket | null;
  joinGame: (gameId: string) => void;
  makeMove: (gameId: number, userId: string, move: any) => void;
  gameState: GameStateData | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const newSocket = io("http://localhost:5001", { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("gameUpdate", (updatedGameState: GameStateData) => {
      setGameState(updatedGameState);
      // dispatch(updateGameState(updatedGameState));
    });

    newSocket.on("moveMade", (data: GameStateData) => {
      setGameState(data);
      // dispatch(updateGameState(data));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  const joinGame = (gameId: string) => {
    if (socket) {
      socket.emit("joinGame", gameId);
    }
  };

  const makeMove = (gameId: number, userId: string, move: any) => {
    if (socket) {
      socket.emit("makeMove", { gameId, userId, move });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinGame, makeMove, gameState }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
