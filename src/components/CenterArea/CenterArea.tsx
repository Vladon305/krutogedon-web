// CenterArea.tsx
import React from "react";
import styles from "./CenterArea.module.scss";
import { Card } from "@/hooks/types";
import GameCard from "../GameCard";

type Props = {
  cards: Card[];
};

const CenterArea: React.FC<Props> = ({ cards }) => {
  return (
    <div className={styles.centerArea}>
      {/* Центральная колода или карты рынка */}
      {cards.map((card, index) => (
        <GameCard
          key={`play-${index}`}
          card={card}
          isPlayable={false}
          className="w-24 h-40 opacity-90"
        />
      ))}
    </div>
  );
};

export default CenterArea;
