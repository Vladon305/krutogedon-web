import React from "react";
import GameCard from "./GameCard";
import { Player } from "@/hooks/types";

type Props = {
  discard: Player["discard"];
};

const DiscardBoard: React.FC<Props> = ({ discard }) => {
  return (
    <div
      className={
        "h-full glass-panel p-4 transition-all duration-300 border-yellow-500 shadow-[0_0_15px_rgba(255,255,0,0.5)]"
      }
    >
      <div className="h-full">
        <h4 className="text-white text-sm font-semibold mb-1">Play Area:</h4>
        <div className="flex flex-wrap gap-2 h-full">
          {discard.map((card, index) => (
            <GameCard
              key={`play-${index}`}
              card={card}
              isPlayable={false}
              className="w-24 h-40 opacity-90"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscardBoard;
