
import React from 'react';
import { Player } from '../types/game';
import GameCard from './GameCard';
import { cn } from '@/lib/utils';

interface PlayerAreaProps {
  player: Player;
  isCurrentPlayer: boolean;
  onPlayCard: (cardIndex: number) => void;
  onAttackPlayer: () => void;
}

const PlayerArea: React.FC<PlayerAreaProps> = ({
  player,
  isCurrentPlayer,
  onPlayCard,
  onAttackPlayer
}) => {
  return (
    <div className={cn(
      "glass-panel p-4 transition-all duration-300",
      isCurrentPlayer ? "border-yellow-500 shadow-[0_0_15px_rgba(255,255,0,0.5)]" : "border-white/10"
    )}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-krutagidon-purple border-2 border-white flex items-center justify-center text-white font-bold mr-2">
            {player.name.substring(0, 1)}
          </div>
          <div>
            <h3 className="text-white font-bold">{player.name}</h3>
            <div className="flex space-x-2 text-xs">
              <div className="bg-red-900 rounded px-1">
                Dead Wizard: {player.deadWizardTokens}
              </div>
              <div className="bg-yellow-600 rounded px-1">
                Cups: {player.krutagidonCups}
              </div>
            </div>
          </div>
        </div>
        
        {!isCurrentPlayer && (
          <button
            onClick={onAttackPlayer}
            className="glowing-button text-xs py-1 px-3"
          >
            Attack
          </button>
        )}
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white mb-1">
          <span>Health: {player.health}/{player.maxHealth}</span>
          <span className="flex items-center">
            <span className="power-icon mr-1">⚡</span> {player.power}
            <span className="chipsin-icon ml-2 mr-1">🍟</span> {player.chipsins}
          </span>
        </div>
        <div className="health-bar">
          <div 
            className="health-bar-fill"
            style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
          />
        </div>
      </div>
      
      {isCurrentPlayer && (
        <div className="mb-3">
          <h4 className="text-white text-sm font-semibold mb-1">Your Hand:</h4>
          <div className="flex flex-wrap gap-2">
            {player.hand.map((card, index) => (
              <GameCard
                key={`hand-${index}`}
                card={card}
                isInHand={true}
                className="w-20 h-32 transform hover:-translate-y-2 transition-transform"
                onClick={() => onPlayCard(index)}
              />
            ))}
          </div>
        </div>
      )}
      
      {player.playArea.length > 0 && (
        <div>
          <h4 className="text-white text-sm font-semibold mb-1">Play Area:</h4>
          <div className="flex flex-wrap gap-2">
            {player.playArea.map((card, index) => (
              <GameCard
                key={`play-${index}`}
                card={card}
                isPlayable={false}
                className="w-16 h-28 opacity-90"
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-400 mt-2">
        <span>Deck: {player.deck.length}</span>
        <span className="mx-2">•</span>
        <span>Discard: {player.discard.length}</span>
      </div>
    </div>
  );
};

export default PlayerArea;
