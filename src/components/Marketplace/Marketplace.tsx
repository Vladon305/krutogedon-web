import React, { useEffect, useState } from "react";
import GameCard from "@/components/GameCard/GameCard";
import { Card } from "@/hooks/types";

interface MarketplaceProps {
  cards: Card[];
  title: string;
  onBuyCard: (cardId: number) => void;
  playerPower?: number | null;
  isOnlyCard?: boolean;
  isShowPower?: boolean;
  className?: string;
}

const Marketplace: React.FC<MarketplaceProps> = ({
  cards,
  title,
  onBuyCard,
  playerPower = null,
  isShowPower = true,
  isOnlyCard = false,
  className,
}) => {
  const [card, setCard] = useState<Card | null>(null);
  useEffect(() => {
    if (isOnlyCard) {
      setCard(cards[0]);
    }
  }, []);

  return (
    <div className={`glass-panel p-4 ${className}`}>
      <h3 className="text-white font-bold mb-3 flex items-center">
        <span className="mr-2">{title}</span>
        {isShowPower && (
          <span className="text-xs bg-black/50 rounded-full px-2 py-0.5">
            Available Power: <span className="power-icon">⚡</span>{" "}
            {playerPower}
          </span>
        )}
      </h3>

      <div className="flex flex-wrap gap-3 justify-center">
        {card ? (
          <GameCard
            key={`market-${card.id}`}
            card={card}
            isPlayable={playerPower >= card?.cost}
            className="w-24 h-40 transition-all duration-300 hover:shadow-neon"
            onClick={() => onBuyCard(card.id)}
          />
        ) : (
          cards.map((card, index) => (
            <GameCard
              key={`market-${index}`}
              card={card}
              isPlayable={playerPower >= card?.cost}
              className="w-24 h-40 transition-all duration-300 hover:shadow-neon"
              onClick={() => onBuyCard(card.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;
