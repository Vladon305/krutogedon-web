import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeMove } from "@/api/socketManager";
import PlayerArea from "./PlayerArea";
import Marketplace from "./Marketplace";
import GameHeader from "./GameHeader";
import AttackModal from "./AttackModal";
import DiscardBoard from "./DiscardBoard";
import { makeMove as makeMoveApi } from "../api/gameApi"; // Импортируем напрямую
import { RootState } from "@/store/store";

interface GameBoardProps {
  game: any;
  socketGameState: any;
}

const GameBoard: React.FC<GameBoardProps> = ({ game, socketGameState }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [attackModalOpen, setAttackModalOpen] = useState(false);
  const [attackingCardDamage, setAttackingCardDamage] = useState(0);

  if (!game || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка игры...</div>
      </div>
    );
  }

  const gameState = socketGameState;
  const currentPlayerIndex = game.currentTurnIndex;
  const currentPlayerId = game.currentTurn;
  const currentPlayer = gameState.players[currentPlayerIndex];
  const myPlayer = gameState.players.find((p: any) => p.userId === user?.id);

  const handlePlayCard = (cardIndex: number) => {
    const currentCard = currentPlayer.hand[cardIndex];
    if (currentCard.isAttack) {
      setAttackingCardDamage(currentCard.damage);
      setAttackModalOpen(true);
    }
    makeMoveApi(user.accessToken, game.id, {
      type: "play-card",
      cardId: currentCard.id,
    })
      .then(() => {
        makeMove(game.id, user.id, {
          type: "play-card",
          cardId: currentCard.id,
        });
      })
      .catch((error) => {
        console.error("Ошибка при выполнении хода:", error);
      });
  };

  const handleAttack = (targetId: string, damage: number) => {
    makeMoveApi(user.accessToken, game.id, { type: "attack", targetId, damage })
      .then(() => {
        makeMove(game.id, user.id, { type: "attack", targetId, damage });
      })
      .catch((error) => {
        console.error("Ошибка при атаке:", error);
      });
  };

  const handleBuyCard = (marketplaceIndex: number, isLegendary: boolean) => {
    makeMoveApi(user.accessToken, game.id, {
      type: "buy-card",
      marketplaceIndex,
      isLegendary,
    })
      .then(() => {
        makeMove(game.id, user.id, {
          type: "buy-card",
          marketplaceIndex,
          isLegendary,
        });
      })
      .catch((error) => {
        console.error("Ошибка при покупке карты:", error);
      });
  };

  const handleEndTurn = () => {
    makeMoveApi(user.accessToken, game.id, { type: "end-turn" })
      .then(() => {
        makeMove(game.id, user.id, { type: "end-turn" });
      })
      .catch((error) => {
        console.error("Ошибка при завершении хода:", error);
      });
  };

  const attackTargets = gameState.players.filter(
    (player: any) => player.id !== currentPlayerId
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <GameHeader
        gameState={gameState}
        onEndTurn={handleEndTurn}
        isCurrentPlayerTurn={myPlayer?.id === currentPlayerId}
      />

      {gameState.gameOver ? (
        <div className="glass-panel p-8 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-yellow-500 mb-4">
            Game Over!
          </h2>
          <p className="text-white text-xl mb-6">
            {gameState.winner?.username} wins with{" "}
            {gameState.winner?.krutagidonCups} Krutagidon Cups!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {gameState.players.map((player: any, index: number) => (
              <div
                key={`result-${index}`}
                className={`glass-panel p-4 ${
                  player.id === gameState.winner?.id
                    ? "border-yellow-500 shadow-neon"
                    : ""
                }`}
              >
                <h3 className="text-white font-bold mb-2 flex items-center">
                  {player.username}
                  {player.id === gameState.winner?.id && (
                    <span className="ml-2 text-yellow-500">👑</span>
                  )}
                </h3>
                <div className="text-white/70 text-sm">
                  Krutagidon Cups: {player.krutagidonCups}
                </div>
                <div className="text-white/70 text-sm">
                  Dead Wizard Tokens: {player.deadWizardTokens}
                </div>
                <div className="text-white/70 text-sm">
                  Cards in Collection:{" "}
                  {player.deck.length +
                    player.discard.length +
                    player.hand.length +
                    player.playArea.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameState.players.map((player: any, index: number) => (
                  <PlayerArea
                    key={`player-${index}`}
                    player={player}
                    isCurrentPlayer={player.id === myPlayer?.id}
                    onPlayCard={handlePlayCard}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Marketplace
                title="Junk Shop"
                cards={gameState.marketplace}
                onBuyCard={(index: number) => handleBuyCard(index, false)}
                playerPower={currentPlayer.power}
              />
            </div>

            <div className="space-y-4 col-span-2 h-full">
              <DiscardBoard
                discard={gameState.players[currentPlayerIndex].discard}
              />
            </div>

            <div className="space-y-4">
              <Marketplace
                title="Legendary Junk Shop"
                cards={gameState.legendaryMarketplace}
                onBuyCard={(index: number) => handleBuyCard(index, true)}
                playerPower={currentPlayer.power}
              />
            </div>
          </div>
        </>
      )}

      <AttackModal
        open={attackModalOpen}
        onClose={() => setAttackModalOpen(false)}
        targets={attackTargets}
        damage={attackingCardDamage}
        onAttack={handleAttack}
      />
    </div>
  );
};

export default GameBoard;
