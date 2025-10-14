import { Player } from "@/hooks/types";
import DiscardDeck from "../DiscardDeck/DiscardDeck";
import { useState } from "react";
import HandOfCards from "../HandOfCards/HandOfCards";
import { cn } from "@/lib/utils";

type Props = {
  player: Player;
  isCurrentPlayer: boolean;
  isPlayerMove: boolean;
  position: "bottom" | "left" | "right" | "top-left" | "top-right";
  onPlayCard: (cardIndex: number) => void;
};

const PlayerArea = ({
  player,
  isCurrentPlayer,
  isPlayerMove,
  position,
  onPlayCard,
}: Props) => {
  const [isOpenDiscard, setIsOpenDiscard] = useState(false);

  // // Размеры
  // const centerWidth = 400; // Ширина CenterArea
  // const centerHeight = 200; // Высота CenterArea
  // const playerWidth = 300;
  // const playerHeight = 400;
  // const gap = 20; // Отступ между элементами

  // // Позиционирование
  // let leftPosition = "50%";
  // let bottomPosition = "auto";
  // let topPosition = "auto";
  // let transform = "translateX(-50%)";

  // if (position === "bottom") {
  //   topPosition = `calc(50% + ${centerHeight / 2 + gap}px)`;
  // } else if (position === "left") {
  //   leftPosition = `calc(50% - ${centerWidth / 2 + playerWidth + gap}px)`;
  //   bottomPosition = "50%";
  //   transform = "translateY(-50%)";
  // } else if (position === "right") {
  //   leftPosition = `calc(50% + ${centerWidth / 2 + gap}px)`;
  //   bottomPosition = "50%";
  //   transform = "translateY(-50%)";
  // } else if (position === "top-left") {
  //   leftPosition = `calc(50% - ${centerWidth / 2 + playerWidth + gap}px)`;
  //   bottomPosition = `calc(50% + ${centerHeight / 2 + gap}px)`;
  //   transform = "none";
  // } else if (position === "top-right") {
  //   leftPosition = `calc(50% + ${centerWidth / 2 + gap}px)`;
  //   bottomPosition = `calc(50% + ${centerHeight / 2 + gap}px)`;
  //   transform = "none";
  // }

  // const style = {
  //   position: "absolute" as const,
  //   left: leftPosition,
  //   bottom: bottomPosition,
  //   top: topPosition,
  //   transform,
  //   width: `${playerWidth}px`,
  //   height: `${playerHeight}px`,
  // };

  const style = {
    width: "300px",
    height: "400px",
  };

  const imageSrc =
    "http://localhost:5001/uploads/" + player?.selectedPlayerArea?.imageUrl;

  return (
    <div
      className={cn(
        "max-w-full max-h-full glass-panel p-4 transition-all duration-300",
        isCurrentPlayer
          ? "border-yellow-500 shadow-[0_0_15px_rgba(255,255,0,0.5)]"
          : "border-white/10"
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-krutagidon-purple border-2 border-white flex items-center justify-center text-white font-bold mr-2">
            {player.username.substring(0, 1)}
          </div>
          <div>
            <h3 className="text-white font-bold">{player.username}</h3>
            <div className="flex space-x-2 text-xs">
              <div className="bg-red-900 rounded px-1">
                Dead Wizard: {player.deadWizardCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-white mb-1">
          <span>
            Health: {player.health}/{player?.maxHealth}
          </span>
          <span className="flex items-center">
            <span className="power-icon mr-1">⚡</span> {player.power}
            <span className="chipsin-icon ml-2 mr-1">🍟</span>{" "}
            {/* {player?.chipsins} */}
          </span>
        </div>
        <div className="health-bar">
          <div
            className="health-bar-fill"
            style={{ width: `${(player.health / player?.maxHealth) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="">
          {player.discard.length > 0 && (
            <DiscardDeck
              discard={player.discard}
              isOpen={isOpenDiscard}
              onClickOpen={() => setIsOpenDiscard(true)}
            />
          )}
        </div>

        <div className="w-full">
          <div className="w-full">
            <HandOfCards
              cards={player.hand}
              onCardClick={onPlayCard}
              overlap={70}
              maxSpread={50}
              isPlayable={isPlayerMove}
            />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* <div className="bg-slate-500 max-h-max">
          <img src={imageSrc} alt="PlayerArea" />
          </div> */}
      </div>
      <div className="text-xs text-gray-400 mt-2">
        <span>Deck: {player.deck.length}</span>
        <span className="mx-2">•</span>
        <span>Discard: {player.discard.length}</span>
      </div>
    </div>
  );
};

export default PlayerArea;
