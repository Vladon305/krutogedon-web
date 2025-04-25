import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  disconnectSocket,
  initSocket,
  joinGame,
  makeMove,
  onAttackNotification,
  onAttackRequired,
  onAttackTargetNotification, // Добавляем новый обработчик
  onAttackTargetRequired,
  onDefenseRequired,
  onGameUpdate,
  onSelectionRequired,
} from "@/api/socketManager";
import PlayerArea from "./PlayerArea/PlayerArea";
import Marketplace from "./Marketplace";
import GameHeader from "./GameHeader";
import AttackModal from "./AttackModal";
import DiscardBoard from "./DiscardBoard";
import {
  cancelAttackTarget,
  destroyCard,
  makeMove as makeMoveApi,
  resolveDefense,
  selectAttackTarget,
  topDeckSelection,
} from "../api/gameApi";
import { RootState } from "@/store/store";
import { Card, Game, Player } from "@/hooks/types";
import { GameState } from "@/hooks/types";
import { useAuth } from "@/hooks/useAuth";
import DefenseModal from "./DefenseModal";
import DestroyCardModal from "./DestroyCardModal";
import TopDeckSelectionModal from "./TopDeckSelectionModal";
import { calculatePlayerPositions, getPlayerPositions } from "@/lib/utils";

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
  const [modalAttackTargets, setModalAttackTargets] = useState<number[]>([]); // Добавляем для модального окна
  const [attackTargetModalOpen, setAttackTargetModalOpen] = useState(false);
  const [attackingCardId, setAttackingCardId] = useState<number | null>(null);
  const [attackData, setAttackData] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const gameBoardContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user || !game) return;

    const socket = initSocket();

    // Передаём playerId при подключении к игре
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

  // 1. Обновляем размеры при монтировании и ресайзе
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка игры...</div>
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
    <div className="container h-full mx-auto p-4 max-w-6xl">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 glass-panel p-4 text-white">
          {notification}
        </div>
      )}
      <GameHeader
        gameState={gameState}
        onEndTurn={handleEndTurn}
        isCurrentPlayerTurn={currentPlayerId === myPlayer?.id}
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
            {gameState.players.map((player, index: number) => (
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
                  Dead Wizard Tokens: {player.deadWizardCount}
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
          <div
            ref={gameBoardContainerRef}
            className="relative max-h-full h-[88%] grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
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
                  player={position.player}
                  isCurrentPlayer={position.player.id === myPlayer?.id}
                  isPlayerMove={currentPlayerId === myPlayer?.id}
                  onPlayCard={handlePlayCard}
                />
              </div>
            ))}

            {/* <div className="space-y-4">
              <Marketplace
                title="Junk Shop"
                cards={gameState.currentMarketplace}
                onBuyCard={(cardId: number) => handleBuyCard(cardId, false)}
                playerPower={currentPlayer.power}
              />
            </div>

            <div className="space-y-4">
              <Marketplace
                title="Legendary Junk Shop"
                cards={gameState.currentLegendaryMarketplace}
                onBuyCard={(cardId: number) => handleBuyCard(cardId, true)}
                playerPower={currentPlayer.power}
              />
            </div> */}
            {/* <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameState.players.map((player: Player, index: number) => (
                  <PlayerArea
                    key={`player-${index}`}
                    player={player}
                    isCurrentPlayer={player.id === myPlayer?.id}
                    isPlayerMove={currentPlayerId === myPlayer?.id}
                    onPlayCard={handlePlayCard}
                  />
                ))}
              </div>
            </div> */}

            {/* <div className="space-y-4">
              <Marketplace
                title="Junk Shop"
                cards={gameState.currentMarketplace}
                onBuyCard={(cardId: number) => handleBuyCard(cardId, false)}
                playerPower={currentPlayer.power}
              />
            </div> */}

            {/* <div className="space-y-4 col-span-2 h-full">
              <DiscardBoard discard={currentPlayer?.discard} />
            </div> */}

            {/* <div className="space-y-4">
              <Marketplace
                title="Legendary Junk Shop"
                cards={gameState.currentLegendaryMarketplace}
                onBuyCard={(cardId: number) => handleBuyCard(cardId, true)}
                playerPower={currentPlayer.power}
              />
            </div> */}
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
          handleDefense(null); // Если закрываем без выбора, считаем, что игрок отказался от защиты
        }}
        defenseCards={defenseCards}
        attackData={attackData?.attackData}
        onDefend={handleDefense}
      />
    </div>
  );
};

export default GameBoard;
