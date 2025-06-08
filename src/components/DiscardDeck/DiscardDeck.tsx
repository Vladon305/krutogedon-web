import React from "react";
import GameCard from "@/components/GameCard/GameCard";
import { Card } from "@/hooks/types";

type Props = { isOpen: boolean; discard: Card[]; onClickOpen: () => void };

const DiscardDeck = ({ isOpen, discard, onClickOpen }: Props) => {
  const lastCard = discard[discard.length - 1];
  console.log("lastCard", lastCard);
  return (
    <div>
      {isOpen ? (
        <></>
      ) : (
        <div>
          <div>Discard</div>
          <div onClick={onClickOpen}>
            {lastCard && (
              <GameCard
                className="w-24 h-36"
                card={lastCard}
                isPlayable={false}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscardDeck;
