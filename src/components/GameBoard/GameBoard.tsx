import React, { useEffect, useState } from "react";
import PlayerArea from "../PlayerArea/PlayerArea";
import CenterArea from "../CenterArea/CenterArea";
import styles from "./GameBoard.module.scss";
import { Game, GameState, Player } from "@/hooks/types";
import MarketplaceModal from "../MarketplaceModal/MarketplaceModal";
import { Button } from "@/components/ui/button";
import GameHeader from "../GameHeader/GameHeader";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useAuth } from "@/hooks/useAuth";
import { makeMove } from "@/api/socketManager";
import {
  makeMove as makeMoveApi,
  selectAttackTarget,
  cancelAttackTarget,
} from "@/api/gameApi";
import {
  onAttackTargetRequired,
  onAttackTargetNotification,
} from "@/api/socketManager";
import AttackModal from "../AttackModal/AttackModal";

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
  const [isOpenMarket, setIsOpenMarket] = useState(false);
  const [idOpenAttackModal, setIdOpenAttackModal] = useState(false);
  const [attackModalData, setAttackModalData] = useState<{
    cardId: number;
    targets: number[];
  } | null>(null);

  const user = useTypedSelector((state) => state.auth.user);

  const currentPlayer = players.find((player) => player.id === currentPlayerId);
  const myPlayer = gameState.players.find((p: Player) => p.id === user?.id);
  const otherPlayers = players.filter(
    (player) => player.id !== currentPlayerId
  );

  // Определяем позиции для остальных игроков
  const playerPositions: ("left" | "right" | "top-left" | "top-right")[] = [
    "right",
    "left",
    "top-left",
    "top-right",
  ];

  // Распределяем остальных игроков по позициям
  const positionedOtherPlayers = otherPlayers.map((player, index) => ({
    player,
    position: playerPositions[index] || "right",
  }));

  const leftPlayers = otherPlayers.slice(
    0,
    Math.floor(otherPlayers.length / 2)
  );
  const rightPlayers = otherPlayers.slice(Math.floor(otherPlayers.length / 2));

  // Восстановление состояния при загрузке/обновлении gameState
  useEffect(() => {
    console.log("Checking pendingPlayCard:", gameState?.pendingPlayCard);

    // Проверяем, есть ли ожидающая карта для текущего игрока
    if (
      gameState?.pendingPlayCard &&
      gameState.pendingPlayCard.playerId === myPlayer?.id
    ) {
      const card = myPlayer.hand.find(
        (c) => c.id === gameState.pendingPlayCard.cardId
      );
      console.log("Found pending card:", card);

      if (card && card.isAttack) {
        // Получаем список доступных целей
        const attackTargets = players
          .filter((p) => p.id !== myPlayer.id && p.health > 0)
          .map((p) => p.id);

        console.log("Opening attack modal with targets:", attackTargets);

        // Открываем модальное окно с данными
        setAttackModalData({
          cardId: gameState.pendingPlayCard.cardId,
          targets: attackTargets,
        });
        setIdOpenAttackModal(true);
      }
    } else {
      // Если нет pendingPlayCard, закрываем модальное окно
      setIdOpenAttackModal(false);
      setAttackModalData(null);
    }
  }, [gameState?.pendingPlayCard, myPlayer, players]);

  // Подписка на события WebSocket
  useEffect(() => {
    if (!user?.id) return;

    console.log("Setting up WebSocket subscriptions for user:", user.id);

    // Подписка на событие выбора цели атаки
    const unsubscribeAttackTarget = onAttackTargetRequired((data) => {
      console.log("Attack target required:", data);
      if (data.playerId === user.id.toString() && data.data) {
        setAttackModalData({
          cardId: data.data.cardId,
          targets: data.data.targets,
        });
        setIdOpenAttackModal(true);
      }
    });

    // Подписка на уведомление об атаке (для других игроков)
    const unsubscribeAttackNotification = onAttackTargetNotification((data) => {
      console.log("Attack target notification:", data);
      // Здесь можно показать уведомление остальным игрокам
      // Например: toast или временное сообщение
    });

    // Очистка подписок при размонтировании
    return () => {
      if (typeof unsubscribeAttackTarget === "function") {
        unsubscribeAttackTarget();
      }
      if (typeof unsubscribeAttackNotification === "function") {
        unsubscribeAttackNotification();
      }
    };
  }, [user?.id]);

  const handlePlayCard = async (cardIndex: number) => {
    if (!currentPlayer) return;

    const currentCard = currentPlayer.hand[cardIndex];
    console.log("Playing card:", currentCard);

    try {
      // Для атакующих карт просто играем карту без opponentId
      // Бэкенд вернет событие attackTargetRequired
      await makeMoveApi(accessToken, game.id, {
        type: "play-card",
        cardId: currentCard.id,
        // НЕ передаем opponentId для атакующих карт
      });
    } catch (error) {
      console.error("Ошибка при разыгрывании карты:", error);
    }
  };

  const handleAttack = async (targetId: number) => {
    try {
      if (!attackModalData || !myPlayer) {
        console.error("No attack data or player");
        return;
      }

      console.log("Attacking target:", targetId);

      // Вызываем API для выбора цели атаки
      await selectAttackTarget(accessToken, game.id, myPlayer.id, targetId);

      console.log("Attack target selected successfully");

      // Модальное окно закроется автоматически через useEffect
      // когда pendingPlayCard будет очищен на бэкенде
    } catch (error) {
      console.error("Ошибка при выборе цели атаки:", error);
    }
  };

  const handleCancelAttack = async () => {
    try {
      if (!myPlayer) {
        console.error("No player found");
        return;
      }

      console.log("Cancelling attack");

      // Вызываем API для отмены выбора цели
      await cancelAttackTarget(accessToken, game.id, myPlayer.id);

      console.log("Attack cancelled successfully");

      // Модальное окно закроется автоматически через useEffect
    } catch (error) {
      console.error("Ошибка при отмене атаки:", error);
      // В случае ошибки все равно закрываем модальное окно
      setIdOpenAttackModal(false);
      setAttackModalData(null);
    }
  };

  const handleEndTurn = () => {
    makeMoveApi(accessToken, game.id, { type: "end-turn" })
      .then(() => makeMove(game.id, user.id.toString(), { type: "end-turn" }))
      .catch((error) => console.error("Ошибка при завершении хода:", error));
  };

  return (
    <div className={styles.gameBoard}>
      <GameHeader
        gameState={gameState}
        onEndTurn={handleEndTurn}
        isCurrentPlayerTurn={currentPlayerId === myPlayer?.id}
        actions={[
          <Button
            onClick={() => {
              console.log("Opening market");
              setIsOpenMarket(true);
            }}
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
          <CenterArea cards={currentPlayer?.playArea || []} />
        </div>

        {/* Текущий игрок внизу */}
        {myPlayer && (
          <div className={styles.currentPlayer}>
            <PlayerArea
              player={myPlayer}
              position="bottom"
              isCurrentPlayer={myPlayer.id === gameState.currentPlayer}
              isPlayerMove={myPlayer.id === gameState.currentPlayer}
              onPlayCard={handlePlayCard}
            />
          </div>
        )}

        {/* Остальные игроки по фиксированным позициям */}
        {/* {positionedOtherPlayers.map(({ player, position }, index) => (
          <div key={player.id} className={styles[position]}>
            <PlayerArea
              player={player}
              position={position}
              isCurrentPlayer={false}
              isPlayerMove={currentPlayerId === gameState.currentPlayer}
              onPlayCard={handlePlayCard}
            />
          </div>
        ))} */}
      </div>

      <MarketplaceModal
        open={isOpenMarket}
        marketplace={gameState.currentMarketplace}
        legendaryMarketplace={gameState.currentLegendaryMarketplace}
        strayMagicMarket={gameState.strayMagicDeck}
        playerPower={currentPlayer?.power || 0}
        onClose={() => setIsOpenMarket(false)}
        handleBuyCard={() => {}}
      />

      <AttackModal
        open={idOpenAttackModal}
        onClose={handleCancelAttack}
        targets={
          attackModalData
            ? players.filter((p) => attackModalData.targets.includes(p.id))
            : []
        }
        damage={
          attackModalData && myPlayer
            ? myPlayer.hand.find((c) => c.id === attackModalData.cardId)
                ?.damage || 0
            : 0
        }
        onAttack={handleAttack}
      />
    </div>
  );
};

export default GameBoard;
