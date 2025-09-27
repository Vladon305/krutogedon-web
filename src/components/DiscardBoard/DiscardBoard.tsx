import React from "react";
import GameCard from "@/components/GameCard/GameCard";
import { Player } from "@/hooks/types";
import styles from "./DiscardBoard.module.scss";

type Props = {
  discard: Player["discard"];
};

const DiscardBoard: React.FC<Props> = ({ discard }) => {
  return (
    <div className={styles.discardBoard}>
      <div className={styles.discardBoard__content}>
        <h4 className={styles.discardBoard__title}>Play Area:</h4>
        <div className={styles.discardBoard__cardList}>
          {discard.map((card, index) => (
            <GameCard
              key={`play-${index}`}
              card={card}
              isPlayable={false}
              className={styles.discardBoard__card}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscardBoard;
