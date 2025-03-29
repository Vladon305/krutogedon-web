import React, { useState } from "react";
import HandOfCards from "../components/HandOfCards";
import { Card } from "../types/game";
import { generateSampleCards } from "../data/cards";
import { Button } from "@/components/ui/button";
import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";

const HandDemoPage: React.FC = () => {
  const [handSize, setHandSize] = useState(5);
  const [cards, setCards] = useState<Card[]>(() => {
    const allCards = generateSampleCards();
    return allCards.slice(0, 5);
  });

  const handleCardClick = (index: number) => {
    toast.info(`Card clicked: ${cards[index].name}`);
  };

  const addCard = () => {
    if (cards.length >= 10) {
      toast.warning("Maximum hand size reached");
      return;
    }

    const allCards = generateSampleCards();
    const randomIndex = Math.floor(Math.random() * allCards.length);
    setCards([...cards, allCards[randomIndex]]);
  };

  const removeCard = () => {
    if (cards.length <= 1) {
      toast.warning("Hand cannot be empty");
      return;
    }

    setCards(cards.slice(0, cards.length - 1));
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <UICard className="w-full max-w-3xl glass-panel">
        <CardHeader>
          <CardTitle className="text-center text-white">
            Card Hand Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-white/80 text-sm text-center mb-4">
              Hover over cards to see them spread apart. Click a card to select
              it.
            </p>

            <div className="flex justify-center gap-4 mb-6">
              <Button onClick={removeCard} variant="outline">
                Remove Card
              </Button>
              <Button onClick={addCard} variant="outline">
                Add Card
              </Button>
            </div>

            <div className="bg-black/30 rounded-lg p-4 h-72 flex items-center justify-center">
              <HandOfCards
                cards={cards}
                onCardClick={handleCardClick}
                maxSpread={50}
                overlap={70}
              />
            </div>
          </div>
        </CardContent>
      </UICard>
    </div>
  );
};

export default HandDemoPage;
