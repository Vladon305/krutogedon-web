import React from "react";
import GameCard from "@/components/GameCard/GameCard";
import { Card } from "@/hooks/types";
import styles from "./DiscardDeck.module.scss";

type Props = { isOpen: boolean; discard: Card[]; onClickOpen: () => void };

const DiscardDeck = ({ isOpen, discard, onClickOpen }: Props) => {
  const lastCard = discard[discard.length - 1];
  console.log("lastCard", lastCard);
  return (
    <div className={styles.discardDeck}>
      {isOpen ? (
        <></>
      ) : (
        <div className={styles.discardDeck__content}>
          <div className={styles.discardDeck__label}>Discard</div>
          <div
            className={styles.discardDeck__cardContainer}
            onClick={onClickOpen}
          >
            {lastCard && (
              <GameCard
                className={styles.discardDeck__card}
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
