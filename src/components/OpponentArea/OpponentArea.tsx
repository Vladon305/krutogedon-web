import { Player } from "@/hooks/types";
import DiscardDeck from "../DiscardDeck/DiscardDeck";
import { useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./OpponentArea.module.scss";

type Props = {
  player: Player;
  isCurrentPlayer: boolean;
  position: "left" | "right" | "top-left" | "top-right";
};

const OpponentArea = ({ player, isCurrentPlayer, position }: Props) => {
  const [isOpenDiscard, setIsOpenDiscard] = useState(false);

  return (
    <div
      className={cn(
        styles.opponentArea,
        "glass-panel p-3 transition-all duration-300",
        isCurrentPlayer
          ? "border-yellow-500 shadow-[0_0_15px_rgba(255,255,0,0.5)]"
          : "border-white/10",
        styles[position]
      )}
    >
      {/* Заголовок с информацией об игроке */}
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-krutagidon-purple border-2 border-white flex items-center justify-center text-white font-bold text-sm mr-2">
          {player.username.substring(0, 1)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm truncate">
            {player.username}
          </h3>
          <div className="flex space-x-1 text-xs">
            <div className="bg-red-900 rounded px-1">
              DW: {player.deadWizardCount}
            </div>
          </div>
        </div>
      </div>

      {/* Полоска здоровья */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-white mb-1">
          <span>
            HP: {player.health}/{player.maxHealth}
          </span>
          <span className="flex items-center">
            <span className="power-icon mr-1">⚡</span> {player.power}
          </span>
        </div>
        <div className="health-bar">
          <div
            className="health-bar-fill"
            style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
          />
        </div>
      </div>

      {/* Колода сброса */}
      <div className="flex justify-center">
        {player.discard.length > 0 && (
          <DiscardDeck
            discard={player.discard}
            isOpen={isOpenDiscard}
            onClickOpen={() => setIsOpenDiscard(true)}
            onClose={() => setIsOpenDiscard(false)}
          />
        )}
      </div>

      {/* Информация о картах */}
      <div className="text-xs text-gray-400 mt-2 text-center">
        <span>Discard: {player.discard.length}</span>
      </div>
    </div>
  );
};

export default OpponentArea;
