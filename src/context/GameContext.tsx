import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";
import { Card, Player, GameState } from "../types/game";
import {
  drawCards,
  generateSampleCards,
  generateStarterDeck,
} from "../data/cards";
import { toast } from "sonner";
import { gameReducer } from "./GameReducer";

// Initial game state
const initialGameState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  currentPlayerId: "",
  marketplace: [],
  legendaryMarketplace: [],
  deadWizardTokensRemaining: 0,
  round: 1,
  gameOver: false,
};

// Create context
interface GameContextProps {
  gameState: GameState;
  setupGame: (playerCount: number) => void;
  startTurn: (playerIndex: number) => void;
  playCard: (playerIndex: number, cardIndex: number) => void;
  attackPlayer: (attackerId: string, targetId: string, damage: number) => void;
  buyCard: (
    buyerIndex: number,
    marketplaceIndex: number,
    isLegendary: boolean
  ) => void;
  endTurn: (playerIndex: number, playerId: string) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

// Create provider
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  const setupGame = (
    playerCount: number
    // { property, familiar, playerArea }
  ) => {
    // Validate player count
    if (playerCount < 2 || playerCount > 5) {
      toast.error("Player count must be between 2 and 5");
      return;
    }

    // Create players
    const players: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      // Generate starter deck
      const deck = generateStarterDeck().sort(() => Math.random() - 0.5);

      // Create player
      const player: Player = {
        id: `player-${i}`,
        name: `Wizard ${i + 1}`,
        health: 20,
        maxHealth: 25,
        power: 0,
        chipsins: 0,
        hand: [],
        deck: deck,
        discard: [],
        playArea: [],
        deadWizardTokens: 0,
        krutagidonCups: 0,
        isActive: i === 0, // First player is active
      };

      // Draw initial hand
      player.hand = drawCards(player, 5);

      players.push(player);
    }

    // Generate marketplace cards (excluding legendary)
    const allCards = generateSampleCards();
    const regularCards = allCards.filter(
      (card) => card.type !== "legend" && card.type !== "megachaos"
    );
    const legendaryCards = allCards.filter(
      (card) => card.type === "legend" || card.type === "megachaos"
    );
    console.log("legendaryCards", legendaryCards);

    // Randomly select 5 cards for marketplace
    const marketplace: Card[] = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * regularCards.length);
      marketplace.push(regularCards[randomIndex]);
      regularCards.splice(randomIndex, 1);
    }

    // Randomly select 3 cards for legendary marketplace
    const legendaryMarketplace: Card[] = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * legendaryCards.length);
      legendaryMarketplace.push(legendaryCards[randomIndex]);
      legendaryCards.splice(randomIndex, 1);
    }

    // Initialize dead wizard tokens (4 more than players)
    const deadWizardTokensRemaining = playerCount + 4;

    // Create game state
    const newGameState: GameState = {
      players,
      currentPlayerIndex: 0,
      currentPlayerId: players[0].id,
      marketplace,
      legendaryMarketplace,
      deadWizardTokensRemaining,
      round: 1,
      gameOver: false,
    };
    console.log("newGameState", newGameState);

    dispatch({ type: "SETUP_GAME", payload: newGameState });
    toast.success("Game setup complete. Let the magic begin!");
  };

  const startTurn = (playerIndex: number) => {
    dispatch({ type: "START_TURN", payload: { playerIndex } });
    toast(`Player ${playerIndex + 1}'s turn begins!`);
  };

  const updateSelectionItems = ({
    property,
    familiar,
    playerArea,
    playerId,
  }: {
    property: Card;
    familiar: Card;
    playerArea: Card;
    playerId: string;
  }) => {
    dispatch({
      type: "UPDATE_SELECTION_ITEMS",
      payload: { property, familiar, playerArea, playerId },
    });
  };

  const playCard = (playerIndex: number, cardIndex: number) => {
    const player = gameState.players[playerIndex];
    const card = player.hand[cardIndex];

    dispatch({ type: "PLAY_CARD", payload: { playerIndex, cardIndex } });
    toast(`${player.name} played ${card.name}`);
  };

  const attackPlayer = (
    attackerId: string,
    targetId: string,
    damage: number
  ) => {
    const attacker = gameState.players.find(
      (player) => player.id === attackerId
    );
    const target = gameState.players.find((player) => player.id === targetId);

    dispatch({
      type: "ATTACK_PLAYER",
      payload: { attackerId, targetId, damage },
    });

    if (target.health > damage) {
      toast.warning(
        `${attacker.name} attacks ${target.name} for ${damage} damage!`
      );
    } else {
      toast.error(`${attacker.name} defeated ${target.name}!`, {
        description: `${target.name} has died and received a Dead Wizard token. ${attacker.name} receives a Krutagidon Cup!`,
      });
    }
  };

  const buyCard = (
    buyerIndex: number,
    marketplaceIndex: number,
    isLegendary: boolean
  ) => {
    const buyer = gameState.players[buyerIndex];
    const marketplace = isLegendary
      ? gameState.legendaryMarketplace
      : gameState.marketplace;
    const card = marketplace[marketplaceIndex];

    if (buyer.power < card.cost) {
      toast.error(`Not enough power to buy ${card.name}`);
      return;
    }

    dispatch({
      type: "BUY_CARD",
      payload: { buyerIndex, marketplaceIndex, isLegendary },
    });
    toast.success(`${buyer.name} bought ${card.name}`, {
      description: `The card costs ${card.cost} power and has been added to your discard pile.`,
    });
  };

  const endTurn = (playerIndex: number, playerId: string) => {
    dispatch({ type: "END_TURN", payload: { playerIndex, playerId } });
    const nextPlayerIndex = (playerIndex + 1) % gameState.players.length;
    toast(
      `Player ${playerIndex + 1}'s turn ends. Player ${
        nextPlayerIndex + 1
      }'s turn begins!`
    );
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setupGame,
        startTurn,
        playCard,
        attackPlayer,
        buyCard,
        endTurn,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
