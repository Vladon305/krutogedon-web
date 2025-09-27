import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  disconnectSocket,
  initSocket,
  joinGame,
  makeMove,
  onAttackNotification,
  onAttackRequired,
  onAttackTargetNotification,
  onAttackTargetRequired,
  onDefenseRequired,
  onGameUpdate,
  onSelectionRequired,
} from "@/api/socketManager";
import PlayerArea from "../PlayerArea/PlayerArea";
import Marketplace from "../Marketplace/Marketplace";
import GameHeader from "../GameHeader/GameHeader";
import AttackModal from "../AttackModal/AttackModal";
import DiscardBoard from "../DiscardBoard/DiscardBoard";
import {
  cancelAttackTarget,
  destroyCard,
  makeMove as makeMoveApi,
  resolveDefense,
  selectAttackTarget,
  topDeckSelection,
} from "../../api/gameApi";
import { RootState } from "@/store/store";
import { Card, Game, Player } from "@/hooks/types";
import { GameState } from "@/hooks/types";
import { useAuth } from "@/hooks/useAuth";
import DefenseModal from "../DefenseModal/DefenseModal";
import DestroyCardModal from "../DestroyCardModal/DestroyCardModal";
import TopDeckSelectionModal from "../TopDeckSelectionModal/TopDeckSelectionModal";
import { calculatePlayerPositions, getPlayerPositions } from "@/lib/utils";
import styles from "./GameBoard.module.scss";

interface GameBoardProps {
  game: Game;
  socketGameState: GameState;
  setSocketGameState: (gameState: GameState) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  game,
  socketGameState,
  setSocketGameState,
}) => {
  const { accessToken } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const [attackModalOpen, setAttackModalOpen] = useState(false);
  const [attackingCardDamage, setAttackingCardDamage] = useState(0);
  const [defenseModalOpen, setDefenseModalOpen] = useState(false);
  const [destroyCardModalOpen, setDestroyCardModalOpen] = useState(false);
  const [topDeckModalOpen, setTopDeckModalOpen] = useState(false);
  const [topDeckCard, setTopDeckCard] = useState<Card | null>(null);
  const [topDeckActions, setTopDeckActions] = useState<string[]>([]);
  const [destroyCards, setDestroyCards] = useState<Card[]>([]);
  const [attackTargets, setAttackTargets] = useState<number[]>([]);
  const [modalAttackTargets, setModalAttackTargets] = useState<number[]>([]);
  const [attackTargetModalOpen, setAttackTargetModalOpen] = useState(false);
  const [attackingCardId, setAttackingCardId] = useState<number | null>(null);
  const [attackData, setAttackData] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const gameBoardContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user || !game) return;

    const socket = initSocket();

    joinGame(game.id.toString(), user.id.toString());

    onGameUpdate((gameState) => {
      setSocketGameState(gameState);
    });

    onDefenseRequired((data) => {
      if (data.attackData.opponentId.toString() === user.id.toString()) {
        setAttackData(data);
        setDefenseModalOpen(true);
      }
    });

    onAttackNotification((data) => {
      if (
        data.attackerId !== user.id.toString() &&
        data.opponentId !== user.id.toString()
      ) {
        setNotification(
          `Player ${data.attackerId} is attacking Player ${data.opponentId} with ${data.damage} damage!`
        );
        setTimeout(() => setNotification(null), 3000);
      }
    });

    onAttackTargetNotification((data) => {
      if (data.playerId !== user.id.toString()) {
        setNotification(
          `Player ${data.playerId} is selecting an attack target.`
        );
        setTimeout(() => setNotification(null), 3000);
      }
    });

    onSelectionRequired((data) => {
      if (data.playerId === user.id.toString()) {
        if (data.data.type === "destroyCardFromDiscard") {
          setDestroyCards(data.data.cards || []);
          setDestroyCardModalOpen(true);
        } else if (
          data.data.type === "checkTopDeckCard" ||
          data.data.type === "drawOrReturn"
        ) {
          setTopDeckCard(data.data.card || null);
          setTopDeckActions(data.data.actions || []);
          setTopDeckModalOpen(true);
        } else if (data.data.type === "viewTopDeckCard") {
          setTopDeckCard(data.data.card || null);
          setTopDeckActions([]);
          setTopDeckModalOpen(true);
        }
      }
    });

    onAttackRequired((data) => {
      if (data.playerId === user.id.toString()) {
        setAttackingCardId(data.data.cardId);
        setAttackingCardDamage(data.data.damage);
        setAttackTargets(data.data.targets);
        setModalAttackTargets(data.data.targets);
        setAttackModalOpen(true);
      }
    });

    onAttackTargetRequired((data) => {
      if (data.playerId === user.id.toString()) {
        setAttackingCardId(data.data.cardId);
        setAttackTargets(data.data.targets);
        setModalAttackTargets(data.data.targets);
        setAttackTargetModalOpen(true);
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [game, user, setSocketGameState]);

  useEffect(() => {
    const updateSize = () => {
      if (gameBoardContainerRef.current) {
        const rect = gameBoardContainerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!game || !user) {
    return (
      <div className={styles.gameBoard__loading}>
        <div className={styles.gameBoard__loadingText}>Загрузка игры...</div>
      </div>
    );
  }

  const gameState = socketGameState;
  const currentPlayerId =
    gameState.currentPlayer || game.gameState.currentPlayer;
  const currentPlayer = gameState.players.find((p) => p.id === currentPlayerId);
  const myPlayer = gameState.players.find((p: Player) => p.id === user?.id);

  const handleDestroyCard = async (cardId: number) => {
    try {
      await destroyCard(accessToken, game.id, user.id, cardId);
    } catch (error) {
      console.error("Ошибка при уничтожении карты:", error);
    }
  };

  const handleTopDeckSelection = async (action: string) => {
    if (!topDeckCard) return;
    try {
      await topDeckSelection(accessToken, game.id, {
        playerId: user.id,
        action,
        cardId: topDeckCard.id,
      });
    } catch (error) {
      console.error("Ошибка при выборе действия с верхней картой:", error);
    }
  };

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

  const handleSelectAttackTarget = async (opponentId: number) => {
    try {
      await selectAttackTarget(accessToken, game.id, user.id, opponentId);
      setAttackTargetModalOpen(false);
      setAttackingCardId(null);
      setAttackTargets([]);
      setModalAttackTargets([]);
    } catch (error) {
      console.error("Ошибка при выборе цели атаки:", error);
    }
  };

  const handleCancelAttackTarget = async () => {
    try {
      await cancelAttackTarget(accessToken, game.id, user.id);
      setAttackTargetModalOpen(false);
      setAttackingCardId(null);
      setAttackTargets([]);
      setModalAttackTargets([]);
      setNotification("Attack target selection cancelled.");
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Ошибка при отмене выбора цели атаки:", error);
    }
  };

  const handleAttack = async (targetId: number, damage: number) => {
    if (attackingCardId === null) {
      console.error("Нет выбранной карты для атаки");
      return;
    }
    try {
      await makeMoveApi(accessToken, game.id, {
        type: "attack",
        cardId: attackingCardId,
        opponentId: targetId,
        damage: attackingCardDamage,
      });
      setAttackModalOpen(false);
      setAttackingCardId(null);
      setAttackingCardDamage(0);
      setAttackTargets([]);
      setModalAttackTargets([]);
    } catch (error) {
      console.error("Ошибка при атаке:", error);
    }
  };

  const handleDefense = (defenseCardId: number | null) => {
    if (!attackData) return;

    resolveDefense(
      accessToken,
      game.id.toString(),
      user.id.toString(),
      defenseCardId
    )
      .then(() => {
        setDefenseModalOpen(false);
        setAttackData(null);
      })
      .catch((error) => {
        console.error("Ошибка при выборе защиты:", error);
      });
  };

  const handleBuyCard = (cardId: number, isLegendary: boolean) => {
    makeMoveApi(accessToken, game.id, {
      type: "buy-card",
      cardId,
      isLegendary,
    })
      .then(() => {
        makeMove(game.id, user.id.toString(), {
          type: "buy-card",
          cardId,
          isLegendary,
        });
      })
      .catch((error) => {
        console.error("Ошибка при покупке карты:", error);
      });
  };

  const handleEndTurn = () => {
    makeMoveApi(accessToken, game.id, { type: "end-turn" })
      .then(() => {
        makeMove(game.id, user.id.toString(), { type: "end-turn" });
      })
      .catch((error) => {
        console.error("Ошибка при завершении хода:", error);
      });
  };

  const attackPlayerTargets = gameState.players.filter(
    (player: any) => player.id !== currentPlayerId && player.health > 0
  );

  const defenseCards = myPlayer?.hand.filter((card) => card.isDefense) || [];

  const playersPosition = useMemo(() => {
    console.log("calc");
    console.log("gameBoardContainerRef", containerSize.width);
    return getPlayerPositions(
      gameState.players,
      myPlayer.id,
      containerSize.width
    );
  }, [containerSize]);
  console.log("playersPosition", playersPosition);

  return (
    <div className={styles.gameBoard}>
      {notification && (
        <div className={styles.gameBoard__notification}>{notification}</div>
      )}
      <GameHeader
        gameState={gameState}
        onEndTurn={handleEndTurn}
        isCurrentPlayerTurn={currentPlayerId === myPlayer?.id}
      />

      {gameState.gameOver ? (
        <div className={styles.gameBoard__gameOver}>
          <h2 className={styles.gameBoard__gameOverTitle}>Game Over!</h2>
          <p className={styles.gameBoard__gameOverText}>
            {gameState.winner?.username} wins with{" "}
            {gameState.winner?.krutagidonCups} Krutagidon Cups!
          </p>

          <div className={styles.gameBoard__playerResults}>
            {gameState.players.map((player, index: number) => (
              <div
                key={`result-${index}`}
                className={`${styles.gameBoard__playerCard} ${
                  player.id === gameState.winner?.id
                    ? styles.gameBoard__playerCardWinner
                    : ""
                }`}
              >
                <h3 className={styles.gameBoard__playerName}>
                  {player.username}
                  {player.id === gameState.winner?.id && (
                    <span className={styles.gameBoard__winnerIcon}>👑</span>
                  )}
                </h3>
                <div className={styles.gameBoard__playerStats}>
                  Krutagidon Cups: {player.krutagidonCups}
                </div>
                <div className={styles.gameBoard__playerStats}>
                  Dead Wizard Tokens: {player.deadWizardCount}
                </div>
                <div className={styles.gameBoard__playerStats}>
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
          <div
            ref={gameBoardContainerRef}
            className={styles.gameBoard__container}
          >
            {playersPosition.map((position, index) => (
              <div
                key={position.id}
                style={{
                  position: "absolute",
                  left: position.left,
                  bottom: position.bottom,
                  transform: position.transform,
                  zIndex: position.zIndex ?? 1,
                  width: 340,
                  height: 520,
                }}
              >
                <PlayerArea
                  key={`player-${index}`}
                  position="left"
                  player={position.player}
                  isCurrentPlayer={position.player.id === myPlayer?.id}
                  isPlayerMove={currentPlayerId === myPlayer?.id}
                  onPlayCard={handlePlayCard}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <DestroyCardModal
        open={destroyCardModalOpen}
        onClose={() => setDestroyCardModalOpen(false)}
        cards={destroyCards}
        onSelect={handleDestroyCard}
      />

      <TopDeckSelectionModal
        open={topDeckModalOpen}
        onClose={() => setTopDeckModalOpen(false)}
        card={topDeckCard}
        actions={topDeckActions}
        onSelect={handleTopDeckSelection}
      />

      <AttackModal
        open={attackModalOpen}
        onClose={() => {
          setAttackModalOpen(false);
          setAttackingCardId(null);
          setAttackingCardDamage(0);
          setAttackTargets([]);
          setModalAttackTargets([]);
        }}
        targets={attackPlayerTargets}
        damage={attackingCardDamage}
        onAttack={handleAttack}
      />

      <AttackModal
        open={attackTargetModalOpen}
        onClose={handleCancelAttackTarget}
        targets={socketGameState?.players.filter((p) =>
          modalAttackTargets?.includes(p.id)
        )}
        onAttack={handleSelectAttackTarget}
      />

      <DefenseModal
        open={defenseModalOpen}
        onClose={() => {
          handleDefense(null);
        }}
        defenseCards={defenseCards}
        attackData={attackData?.attackData}
        onDefend={handleDefense}
      />
    </div>
  );
};

export default GameBoard;
