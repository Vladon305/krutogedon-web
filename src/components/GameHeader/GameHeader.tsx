import React from "react";
import { Button } from "@/components/ui/button";
import { Game, GameState } from "@/hooks/types";

interface GameHeaderProps {
  gameState: GameState;
  onEndTurn: () => void;
  isCurrentPlayerTurn: boolean;
  actions?: React.ReactNode[];
}

const GameHeader: React.FC<GameHeaderProps> = ({
  gameState,
  onEndTurn,
  isCurrentPlayerTurn,
  actions,
}) => {
  const currentPlayerId = gameState.currentPlayer;
  const currentPlayer = gameState.players.find((p) => p.id === currentPlayerId);

  return (
    <div className="glass-panel p-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text">
            Krutagidon: Extremely Spicy Chipsychosis
          </h1>
          <div className="text-white/70 text-sm">Round: {gameState?.turn}</div>
        </div>

        <div className="flex items-center">
          {actions.map((action) => action)}
        </div>

        <div className="flex items-center">
          <div className="mr-4 text-right">
            <div className="text-white font-semibold">
              Current Turn: {currentPlayer.username}
            </div>
            <div className="text-xs text-white/70">
              {isCurrentPlayerTurn ? "Your turn" : "Waiting for your turn..."}
            </div>
          </div>

          {isCurrentPlayerTurn && (
            <Button onClick={onEndTurn} className="glowing-button">
              End Turn
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
