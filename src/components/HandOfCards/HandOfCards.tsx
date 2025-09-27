import React, { useState } from "react";
import GameCard from "@/components/GameCard/GameCard";
import { cn } from "@/lib/utils";
import { Card } from "@/hooks/types";
import styles from "./HandOfCards.module.scss";

interface HandOfCardsProps {
  cards: Card[];
  onCardClick?: (index: number) => void;
  isPlayable?: boolean;
  className?: string;
  maxSpread?: number;
  overlap?: number;
}

const HandOfCards: React.FC<HandOfCardsProps> = ({
  cards,
  onCardClick,
  className,
  isPlayable = true,
  maxSpread = 40,
  overlap = 70,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getCardStyle = (index: number) => {
    const isHovered = hoveredIndex !== null;
    const totalCards = cards.length;

    let leftPosition = `${
      (index * (100 - overlap)) / (totalCards > 1 ? totalCards - 1 : 1)
    }%`;
    let zIndex = index;
    let transform = "rotate(0deg)";

    if (isHovered) {
      const spreadAdjustment = maxSpread / totalCards;

      if (hoveredIndex < index) {
        leftPosition = `${
          (index * (100 - overlap)) / (totalCards > 1 ? totalCards - 1 : 1) +
          spreadAdjustment
        }%`;
      } else if (hoveredIndex > index) {
        leftPosition = `${
          (index * (100 - overlap)) / (totalCards > 1 ? totalCards - 1 : 1) -
          spreadAdjustment
        }%`;
      }

      zIndex = index === hoveredIndex ? 100 : index;

      const rotationAngle = (index - (totalCards - 1) / 2) * 3;
      transform = `rotate(${rotationAngle}deg)`;
    }

    return {
      left: leftPosition,
      zIndex,
      transform,
    };
  };

  return (
    <div className={cn(styles.handOfCards, className)}>
      {cards.map((card, index) => (
        <div
          key={`hand-card-${index}`}
          className={styles.handOfCards__card}
          style={getCardStyle(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onCardClick && isPlayable && onCardClick(index)}
        >
          <GameCard
            card={card}
            isInHand={true}
            className={styles.handOfCards__gameCard}
            isPlayable={isPlayable}
          />
        </div>
      ))}
    </div>
  );
};

export default HandOfCards;
