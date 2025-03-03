
import React from 'react';
import { GameState } from '../types/game';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  gameState: GameState;
  onEndTurn: () => void;
  isCurrentPlayerTurn: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  gameState,
  onEndTurn,
  isCurrentPlayerTurn
}) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  
  return (
    <div className="glass-panel p-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text">
            Krutagidon: Extremely Spicy Chipsychosis
          </h1>
          <div className="text-white/70 text-sm">
            Round: {gameState.round} • Dead Wizard Tokens Remaining: {gameState.deadWizardTokensRemaining}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 text-right">
            <div className="text-white font-semibold">
              Current Turn: {currentPlayer.name}
            </div>
            <div className="text-xs text-white/70">
              {isCurrentPlayerTurn ? "Your turn" : "Waiting for your turn..."}
            </div>
          </div>
          
          {isCurrentPlayerTurn && (
            <Button
              onClick={onEndTurn}
              className="glowing-button"
            >
              End Turn
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
