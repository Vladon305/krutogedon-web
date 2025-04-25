import React, { useState } from "react";
import PlayerArea from "../PlayerArea/PlayerArea";
import CenterArea from "../CenterArea/CenterArea";
import styles from "./GameBoard.module.scss";
import { Game, GameState, Player } from "@/hooks/types";
import MarketplaceModal from "../MarketplaceModal/MarketplaceModal";
import { Button } from "@/components/ui/button";
import GameHeader from "../GameHeader";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useAuth } from "@/hooks/useAuth";
import { makeMove } from "@/api/socketManager";
import { makeMove as makeMoveApi } from "@/api/gameApi";

interface GameBoardProps {
  game: Game;
  gameState: GameState;
  players: Player[];
  currentPlayerId: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  game,
  gameState,
  players,
  currentPlayerId,
}) => {
  const { accessToken } = useAuth();
  const [openMarket, setOpenMarket] = useState(false);
  const user = useTypedSelector((state) => state.auth.user);

  const currentPlayer = players.find((player) => player.id === currentPlayerId);
  const myPlayer = gameState.players.find((p: Player) => p.id === user?.id);
  const otherPlayers = players.filter(
    (player) => player.id !== currentPlayerId
  );

  // Определяем позиции для остальных игроков
  const playerPositions: ("left" | "right" | "top-left" | "top-right")[] = [
    "right", // Позиция 1
    "left", // Позиция 2
    "top-left", // Позиция 3
    "top-right", // Позиция 4
  ];

  // Распределяем остальных игроков по позициям
  const positionedOtherPlayers = otherPlayers.map((player, index) => ({
    player,
    position: playerPositions[index] || "right", // Если больше 4 игроков, используем "right" по умолчанию
  }));

  const leftPlayers = otherPlayers.slice(
    0,
    Math.floor(otherPlayers.length / 2)
  );
  const rightPlayers = otherPlayers.slice(Math.floor(otherPlayers.length / 2));

  const handlePlayCard = async (cardIndex: number) => {
    const currentCard = currentPlayer.hand[cardIndex];
    try {
      await makeMoveApi(accessToken, game.id, {
        type: "play-card",
        cardId: currentCard.id,
      });
    } catch (error) {
      console.error("Ошибка при разыгрывании карты:", error);
    }
  };

  const handleEndTurn = () => {
    makeMoveApi(accessToken, game.id, { type: "end-turn" })
      .then(() => makeMove(game.id, user.id.toString(), { type: "end-turn" }))
      .catch((error) => console.error("Ошибка при завершении хода:", error));
  };

  return (
    <div className={styles.gameBoard}>
      <div className={styles.tableBackground} />
      <GameHeader
        gameState={gameState}
        onEndTurn={handleEndTurn}
        isCurrentPlayerTurn={currentPlayerId === myPlayer?.id}
        actions={[
          <Button
            onClick={() => setOpenMarket(true)}
            variant="outline"
            className="border-krutagidon-red text-white"
          >
            Market
          </Button>,
        ]}
      />
      <div className={styles.gridContainer}>
        {/* Центральная область */}
        <div className={styles.centerArea}>
          <CenterArea cards={currentPlayer.playArea} />
        </div>

        {/* Текущий игрок внизу */}
        {currentPlayer && (
          <div className={styles.currentPlayer}>
            <PlayerArea
              player={currentPlayer}
              position="bottom"
              index={0}
              isCurrentPlayer={true}
              isPlayerMove={currentPlayerId === gameState.currentPlayer}
              onPlayCard={handlePlayCard}
            />
          </div>
        )}

        {/* Остальные игроки по фиксированным позициям */}
        {positionedOtherPlayers.map(({ player, position }, index) => (
          <div key={player.id} className={styles[position]}>
            <PlayerArea
              player={player}
              position={position}
              index={index}
              isCurrentPlayer={false}
              isPlayerMove={currentPlayerId === gameState.currentPlayer}
              onPlayCard={handlePlayCard}
            />
          </div>
        ))}
      </div>
      <MarketplaceModal
        open={openMarket}
        marketplace={gameState.currentMarketplace}
        legendaryMarketplace={gameState.currentLegendaryMarketplace}
        strayMagicMarket={gameState.strayMagicDeck}
        playerPower={currentPlayer?.power || 0}
        onClose={() => setOpenMarket(false)}
        handleBuyCard={() => {}}
      />
    </div>
  );
};

export default GameBoard;
