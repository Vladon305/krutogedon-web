import React, { useEffect, useState } from "react";
import PlayerArea from "../PlayerArea/PlayerArea";
import OpponentArea from "../OpponentArea/OpponentArea";
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
  resolveDefense,
} from "@/api/gameApi";
import {
  onAttackTargetRequired,
  onAttackTargetNotification,
  onDefenseRequired,
} from "@/api/socketManager";
import AttackModal from "../AttackModal/AttackModal";
import { DefenseDialog } from "../DefenseDialog/DefenseDialog";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isOpenMarket, setIsOpenMarket] = useState(false);
  const [idOpenAttackModal, setIdOpenAttackModal] = useState(false);
  const [attackModalData, setAttackModalData] = useState<{
    cardId: number;
    targets: number[];
  } | null>(null);
  const [isDefenseDialogOpen, setIsDefenseDialogOpen] = useState(false);
  const [defenseData, setDefenseData] = useState<{
    gameId: string;
    attackData: {
      attackerId: number;
      opponentId: number;
      cardId: number;
      damage: number;
    };
  } | null>(null);

  const user = useTypedSelector((state) => state.auth.user);

  const currentPlayer = players.find((player) => player.id === currentPlayerId);
  const myPlayer = gameState.players.find((p: Player) => p.id === user?.id);
  const opponents = gameState.players.filter(
    (player: Player) => player.id !== myPlayer?.id
  );

  // Функция для распределения соперников по позициям
  const getOpponentPositions = () => {
    const positions: {
      player: Player;
      position: "left" | "right" | "top-left" | "top-right";
    }[] = [];

    if (opponents.length === 0) return positions;

    if (opponents.length === 1) {
      // 1 соперник - слева
      positions.push({ player: opponents[0], position: "left" });
    } else if (opponents.length === 2) {
      // 2 соперника - 1 слева, 1 справа
      positions.push({ player: opponents[0], position: "left" });
      positions.push({ player: opponents[1], position: "right" });
    } else if (opponents.length === 3) {
      // 3 соперника - 1 слева, 1 справа, 1 сверху слева
      positions.push({ player: opponents[0], position: "left" });
      positions.push({ player: opponents[1], position: "right" });
      positions.push({ player: opponents[2], position: "top-left" });
    } else if (opponents.length >= 4) {
      // 4 соперника - 2 слева (один сверху), 2 справа (один сверху)
      positions.push({ player: opponents[0], position: "left" });
      positions.push({ player: opponents[1], position: "right" });
      positions.push({ player: opponents[2], position: "top-left" });
      positions.push({ player: opponents[3], position: "top-right" });
    }

    return positions;
  };

  const positionedOpponents = getOpponentPositions();

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

    // Подписка на событие защиты
    const unsubscribeDefense = onDefenseRequired((data) => {
      console.log("Defense required:", data);
      if (myPlayer && data.attackData.opponentId === myPlayer.id) {
        setDefenseData(data);
        setIsDefenseDialogOpen(true);
      }
    });

    // Очистка подписок при размонтировании
    return () => {
      if (typeof unsubscribeAttackTarget === "function") {
        unsubscribeAttackTarget();
      }
      if (typeof unsubscribeAttackNotification === "function") {
        unsubscribeAttackNotification();
      }
      if (typeof unsubscribeDefense === "function") {
        unsubscribeDefense();
      }
    };
  }, [user?.id, myPlayer]);

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
    } catch (error: any) {
      console.error("Ошибка при разыгрывании карты:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.response?.data?.message || error.message || "Произошла ошибка при разыгрывании карты",
      });
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
    } catch (error: any) {
      console.error("Ошибка при выборе цели атаки:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.response?.data?.message || error.message || "Произошла ошибка при выборе цели атаки",
      });
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
    } catch (error: any) {
      console.error("Ошибка при отмене атаки:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.response?.data?.message || error.message || "Произошла ошибка при отмене атаки",
      });
      // В случае ошибки все равно закрываем модальное окно
      setIdOpenAttackModal(false);
      setAttackModalData(null);
    }
  };

  const handleEndTurn = async () => {
    try {
      await makeMoveApi(accessToken, game.id, { type: "end-turn" });
      makeMove(game.id, user.id.toString(), { type: "end-turn" });
    } catch (error: any) {
      console.error("Ошибка при завершении хода:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.response?.data?.message || error.message || "Произошла ошибка при завершении хода",
      });
    }
  };

  const handleDefense = async (defenseCardId: number | null) => {
    try {
      if (!defenseData || !myPlayer) {
        console.error("No defense data or player");
        return;
      }

      console.log("Defending with card:", defenseCardId);

      // Вызываем API для разрешения защиты
      await resolveDefense(
        accessToken,
        game.id.toString(),
        myPlayer.id.toString(),
        defenseCardId || undefined
      );

      console.log("Defense resolved successfully");

      // Закрываем диалог
      setIsDefenseDialogOpen(false);
      setDefenseData(null);
    } catch (error: any) {
      console.error("Ошибка при защите:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.response?.data?.message || error.message || "Произошла ошибка при защите",
      });
      // В случае ошибки все равно закрываем диалог
      setIsDefenseDialogOpen(false);
      setDefenseData(null);
    }
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

        {/* Соперники по позициям */}
        {positionedOpponents.map(({ player, position }) => (
          <div key={player.id} className={styles[position]}>
            <OpponentArea
              player={player}
              position={position}
              isCurrentPlayer={player.id === gameState.currentPlayer}
            />
          </div>
        ))}
      </div>

      <MarketplaceModal
        open={isOpenMarket}
        marketplace={gameState.currentMarketplace}
        legendaryMarketplace={gameState.currentLegendaryMarketplace}
        strayMagicMarket={gameState.strayMagicDeck}
        playerPower={currentPlayer?.power || 0}
        onClose={() => setIsOpenMarket(false)}
        gameId={game.id.toString()}
        playerId={myPlayer?.id.toString()}
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

      <DefenseDialog
        open={isDefenseDialogOpen}
        onClose={() => {
          setIsDefenseDialogOpen(false);
          setDefenseData(null);
        }}
        attackData={defenseData?.attackData || null}
        defenseCards={
          myPlayer ? myPlayer.hand.filter((card) => card.isDefense) : []
        }
        onDefend={handleDefense}
        attackerName={
          defenseData
            ? players.find((p) => p.id === defenseData.attackData.attackerId)
                ?.username || "Неизвестный игрок"
            : ""
        }
      />
    </div>
  );
};

export default GameBoard;
