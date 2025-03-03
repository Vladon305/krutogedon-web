
import React, { useState } from 'react';
import { Card as GameCardType } from '../types/game';
import { cn } from '@/lib/utils';

interface GameCardProps {
  card: GameCardType;
  onClick?: () => void;
  className?: string;
  isPlayable?: boolean;
  isInHand?: boolean;
  showBack?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ 
  card, 
  onClick, 
  className, 
  isPlayable = true, 
  isInHand = false,
  showBack = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCardTypeClass = () => {
    switch (card.type) {
      case 'legend':
        return 'card-type-legend';
      case 'spell':
      case 'madmagic':
        return 'card-type-spell';
      case 'creature':
        return 'card-type-creature';
      case 'treasure':
      case 'place':
        return 'card-type-artifact';
      default:
        return 'card-type-starter';
    }
  };
  
  const getCardTypeIcon = () => {
    switch (card.type) {
      case 'legend':
        return '👑';
      case 'spell':
      case 'madmagic':
        return '✨';
      case 'creature':
        return '👹';
      case 'treasure':
        return '💎';
      case 'place':
        return '🏰';
      case 'sign':
        return '⚡';
      case 'familiar':
        return '🐦';
      default:
        return '';
    }
  };
  
  const getRarityStars = () => {
    switch (card.rarity) {
      case 'legendary':
        return '★★★★★';
      case 'rare':
        return '★★★★';
      case 'uncommon':
        return '★★★';
      case 'common':
      default:
        return '★★';
    }
  };
  
  const handleClick = () => {
    if (isPlayable && onClick) {
      onClick();
    }
  };
  
  return (
    <div
      className={cn(
        "game-card", 
        getCardTypeClass(),
        { 
          "cursor-pointer transform transition-all": isPlayable,
          "opacity-50 cursor-not-allowed": !isPlayable,
          "hover:scale-105 z-10": isInHand && isHovered,
        },
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("game-card-inner", { "animate-card-flip": showBack })}>
        <div className="game-card-front">
          <div className="p-2 flex flex-col h-full">
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs font-bold text-white">{card.name}</div>
              <div className="bg-yellow-500 text-black font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {card.cost}
              </div>
            </div>
            
            {card.imagePath ? (
              <div className="w-full h-20 rounded overflow-hidden mb-1">
                <img
                  src={card.imagePath}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-20 bg-gray-700 rounded flex items-center justify-center mb-1">
                <span className="text-3xl">{getCardTypeIcon()}</span>
              </div>
            )}
            
            <div className="text-xs text-white mb-1 flex-grow overflow-y-auto">
              {card.description}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-yellow-500 text-xs">{getRarityStars()}</div>
              
              {card.isAttack && (
                <div className="text-red-500 font-bold text-xs">⚔️ ATTACK</div>
              )}
              
              {card.isDefense && (
                <div className="text-blue-500 font-bold text-xs">🛡️ DEFENSE</div>
              )}
              
              {card.isPermanent && (
                <div className="text-purple-500 font-bold text-xs">♾️ PERMANENT</div>
              )}
            </div>
          </div>
        </div>
        
        {showBack && (
          <div className="game-card-back">
            <div className="text-4xl">🔮</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
