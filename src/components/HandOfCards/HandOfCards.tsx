import React, { useState } from "react";
import GameCard from "@/components/GameCard/GameCard";
import { cn } from "@/lib/utils";
import { Card } from "@/hooks/types";

interface HandOfCardsProps {
  cards: Card[];
  onCardClick?: (index: number) => void;
  isPlayable?: boolean;
  className?: string;
  maxSpread?: number; // Maximum amount of spread when hovering
  overlap?: number; // How much cards overlap by default (in percentage)
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

  // Calculate the base position and offset for each card
  const getCardStyle = (index: number) => {
    const isHovered = hoveredIndex !== null;
    const totalCards = cards.length;

    // Base positioning (cards slightly overlapping)
    let leftPosition = `${
      (index * (100 - overlap)) / (totalCards > 1 ? totalCards - 1 : 1)
    }%`;
    let zIndex = index;
    let transform = "rotate(0deg)";

    // When a card is hovered, spread them out more
    if (isHovered) {
      const spreadAdjustment = maxSpread / totalCards;

      if (hoveredIndex < index) {
        // Cards to the right of hovered card move further right
        leftPosition = `${
          (index * (100 - overlap)) / (totalCards > 1 ? totalCards - 1 : 1) +
          spreadAdjustment
        }%`;
      } else if (hoveredIndex > index) {
        // Cards to the left of hovered card move further left
        leftPosition = `${
          (index * (100 - overlap)) / (totalCards > 1 ? totalCards - 1 : 1) -
          spreadAdjustment
        }%`;
      }

      // Hovered card comes to the front
      zIndex = index === hoveredIndex ? 100 : index;

      // Add a slight rotation to simulate hand fan effect
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
    <div
      className={cn(
        "hand-container relative h-48 md:h-52 lg:h-56 w-full",
        className
      )}
    >
      {cards.map((card, index) => (
        <div
          key={`hand-card-${index}`}
          className="absolute transition-all duration-300 ease-in-out transform-gpu"
          style={getCardStyle(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onCardClick && isPlayable && onCardClick(index)}
        >
          <GameCard
            card={card}
            isInHand={true}
            className="w-24 h-36 md:w-28 md:h-44 shadow-lg hover:shadow-xl"
            isPlayable={isPlayable}
          />
        </div>
      ))}
    </div>
  );
};

export default HandOfCards;
