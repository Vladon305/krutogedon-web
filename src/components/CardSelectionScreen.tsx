import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import GameCard from "./GameCard";
import { Card } from "../types/game";
import { ArrowLeft } from "lucide-react";
import { playerAreas } from "@/data/playerAreas";
import { properties } from "@/data/properties";
import { familiars } from "@/data/familiars";
import { cn, getRandomElements } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface CardSelectionScreenProps {
  onComplete: (selectedItems: {
    property: Card;
    familiar: Card;
    playerArea: Card;
  }) => void;
}

const CardSelectionScreen: React.FC<CardSelectionScreenProps> = ({
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const game = useSelector((state: RootState) => state.game.currentGame);
  const user = useSelector((state: RootState) => state.auth.user);

  const myPlayer = game?.gameState.players.find((p) => p.userId === user?.id);
  const allPlayersSelected = game?.gameState.players.every(
    (p) => p.selectionCompleted
  );

  const randomProperties = useMemo(() => getRandomElements(properties, 2), []);
  const randomFamiliars = useMemo(() => getRandomElements(familiars, 2), []);

  const stepCards = {
    1: randomProperties,
    2: randomFamiliars,
    3: playerAreas,
  };

  const stepTitles = {
    1: "Выберите свойство",
    2: "Выберите фамильяра",
    3: "Выберите планшет",
  };

  const handleCardSelect = (card: Card) => {
    const newSelectedCards = [...selectedCards, card];
    setSelectedCards(newSelectedCards);

    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        property: newSelectedCards[0],
        familiar: newSelectedCards[1],
        playerArea: newSelectedCards[2],
      });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setSelectedCards(selectedCards.slice(0, -1));
    }
  };

  if (myPlayer?.selectionCompleted && !allPlayersSelected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="glass-panel p-10 w-full max-w-4xl animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Ожидание других игроков...
          </h2>
          <p className="text-white/60 text-center">
            Вы уже выбрали свои карты. Пожалуйста, подождите, пока другие игроки
            завершат выбор.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="glass-panel p-10 w-full max-w-4xl animate-fade-in-up">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {stepTitles[step as keyof typeof stepTitles]}
          </h2>
          <div className="flex justify-center items-center space-x-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full ${
                  s === step ? "bg-krutagidon-purple" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-white/60">
            Шаг {step} из 3: Выберите одну карту для вашей стартовой колоды
          </p>
        </div>

        <div className="h-[50vh] overflow-y-auto grid grid-cols-2 gap-6 mb-8">
          {stepCards[step as keyof typeof stepCards].map((card, index) => (
            <div key={index} className="flex flex-col items-center">
              <GameCard
                card={card}
                isPlayable={true}
                className={cn(
                  "w-3/4 transform hover:scale-105 transition-all hover:shadow-neon cursor-pointer",
                  {
                    "w-full": card.type === "property",
                    "w-34": card.type === "playerArea",
                  }
                )}
                onClick={() => handleCardSelect(card)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              className="bg-black/50 hover:bg-krutagidon-purple/50"
              onClick={handlePrevStep}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Назад
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardSelectionScreen;
