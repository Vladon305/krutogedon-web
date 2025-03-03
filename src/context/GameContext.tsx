
import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { Card, Player, GameState, GameAction } from '../types/game';
import { generateSampleCards, generateStarterDeck } from '../data/cards';
import { toast } from 'sonner';

// Initial game state
const initialGameState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  marketplace: [],
  legendaryMarketplace: [],
  deadWizardTokensRemaining: 0,
  round: 1,
  gameOver: false
};

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SETUP_GAME':
      return action.payload;
    case 'START_TURN':
      return {
        ...state,
        currentPlayerIndex: action.payload.playerIndex
      };
    case 'PLAY_CARD':
      const { playerIndex, cardIndex } = action.payload;
      const updatedPlayers = [...state.players];
      const player = updatedPlayers[playerIndex];
      const card = player.hand[cardIndex];
      
      // Remove card from hand
      const newHand = [...player.hand];
      newHand.splice(cardIndex, 1);
      
      // Add power from sign cards
      if (card.type === 'sign') {
        player.power += 1;
      }
      
      // Add card to play area if it's a permanent
      if (card.isPermanent) {
        player.playArea.push(card);
      } else {
        player.discard.push(card);
      }
      
      player.hand = newHand;
      
      return {
        ...state,
        players: updatedPlayers
      };
    case 'ATTACK_PLAYER':
      const { attackerIndex, targetIndex, damage } = action.payload;
      const playersAfterAttack = [...state.players];
      const targetPlayer = playersAfterAttack[targetIndex];
      
      targetPlayer.health -= damage;
      
      // Check if player died
      if (targetPlayer.health <= 0) {
        targetPlayer.deadWizardTokens += 1;
        targetPlayer.health = 20; // Resurrect with full health
        
        // Give attacker a Krutagidon Cup
        playersAfterAttack[attackerIndex].krutagidonCups += 1;
        
        // Decrease available dead wizard tokens
        const tokensRemaining = state.deadWizardTokensRemaining - 1;
        
        // Check for game end condition
        if (tokensRemaining <= 0) {
          return {
            ...state,
            players: playersAfterAttack,
            deadWizardTokensRemaining: tokensRemaining,
            gameOver: true,
            winner: playersAfterAttack.reduce((prev, current) => 
              (prev.krutagidonCups > current.krutagidonCups) ? prev : current
            )
          };
        }
        
        return {
          ...state,
          players: playersAfterAttack,
          deadWizardTokensRemaining: tokensRemaining
        };
      }
      
      return {
        ...state,
        players: playersAfterAttack
      };
    case 'BUY_CARD':
      const { buyerIndex, marketplaceIndex, isLegendary } = action.payload;
      const playersAfterBuy = [...state.players];
      const buyer = playersAfterBuy[buyerIndex];
      
      // Get the marketplace and card
      const marketplace = isLegendary ? [...state.legendaryMarketplace] : [...state.marketplace];
      const cardToBuy = marketplace[marketplaceIndex];
      
      // Check if player has enough power
      if (buyer.power < cardToBuy.cost) {
        return state;
      }
      
      // Remove power from player
      buyer.power -= cardToBuy.cost;
      
      // Add card to player's discard pile
      buyer.discard.push(cardToBuy);
      
      // Remove and replace card in marketplace
      marketplace.splice(marketplaceIndex, 1);
      const allCards = generateSampleCards();
      const eligibleCards = isLegendary 
        ? allCards.filter(card => card.rarity === 'legendary' || card.rarity === 'rare')
        : allCards.filter(card => card.rarity !== 'legendary');
      
      if (eligibleCards.length > 0) {
        const newCard = eligibleCards[Math.floor(Math.random() * eligibleCards.length)];
        marketplace.push(newCard);
      }
      
      // Update the appropriate marketplace
      if (isLegendary) {
        return {
          ...state,
          players: playersAfterBuy,
          legendaryMarketplace: marketplace
        };
      } else {
        return {
          ...state,
          players: playersAfterBuy,
          marketplace: marketplace
        };
      }
    case 'END_TURN':
      const { playerIndex: currentPlayerIndex } = action.payload;
      const playersAfterTurn = [...state.players];
      const currentPlayer = playersAfterTurn[currentPlayerIndex];
      
      // Discard hand
      currentPlayer.discard = [...currentPlayer.discard, ...currentPlayer.hand];
      
      // Draw 5 new cards
      const newCards = drawCards(currentPlayer, 5);
      currentPlayer.hand = newCards;
      
      // Reset power
      currentPlayer.power = 0;
      
      // Move to next player
      const nextPlayerIndex = (currentPlayerIndex + 1) % playersAfterTurn.length;
      
      // Increment round if we've gone through all players
      const newRound = nextPlayerIndex === 0 ? state.round + 1 : state.round;
      
      return {
        ...state,
        players: playersAfterTurn,
        currentPlayerIndex: nextPlayerIndex,
        round: newRound
      };
    default:
      return state;
  }
};

// Helper function to draw cards
const drawCards = (player: Player, count: number): Card[] => {
  const cards: Card[] = [];
  
  for (let i = 0; i < count; i++) {
    // If deck is empty, shuffle discard pile into deck
    if (player.deck.length === 0) {
      if (player.discard.length === 0) {
        break; // No more cards to draw
      }
      
      // Shuffle discard pile
      const shuffledDiscard = [...player.discard].sort(() => Math.random() - 0.5);
      player.deck = shuffledDiscard;
      player.discard = [];
    }
    
    // Draw top card
    if (player.deck.length > 0) {
      const drawnCard = player.deck.pop()!;
      cards.push(drawnCard);
    }
  }
  
  return cards;
};

// Create context
interface GameContextProps {
  gameState: GameState;
  setupGame: (playerCount: number) => void;
  startTurn: (playerIndex: number) => void;
  playCard: (playerIndex: number, cardIndex: number) => void;
  attackPlayer: (attackerIndex: number, targetIndex: number, damage: number) => void;
  buyCard: (buyerIndex: number, marketplaceIndex: number, isLegendary: boolean) => void;
  endTurn: (playerIndex: number) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

// Create provider
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  const setupGame = (playerCount: number) => {
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
        isActive: i === 0 // First player is active
      };
      
      // Draw initial hand
      player.hand = drawCards(player, 5);
      
      players.push(player);
    }
    
    // Generate marketplace cards (excluding legendary)
    const allCards = generateSampleCards();
    const regularCards = allCards.filter(card => card.rarity !== 'legendary' && card.type !== 'megachaos');
    const legendaryCards = allCards.filter(card => card.rarity === 'legendary' || card.type === 'megachaos');
    
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
      marketplace,
      legendaryMarketplace,
      deadWizardTokensRemaining,
      round: 1,
      gameOver: false
    };
    
    dispatch({ type: 'SETUP_GAME', payload: newGameState });
    toast.success("Game setup complete. Let the magic begin!");
  };

  const startTurn = (playerIndex: number) => {
    dispatch({ type: 'START_TURN', payload: { playerIndex } });
    toast(`Player ${playerIndex + 1}'s turn begins!`);
  };

  const playCard = (playerIndex: number, cardIndex: number) => {
    const player = gameState.players[playerIndex];
    const card = player.hand[cardIndex];
    
    dispatch({ type: 'PLAY_CARD', payload: { playerIndex, cardIndex } });
    toast(`${player.name} played ${card.name}`);
  };

  const attackPlayer = (attackerIndex: number, targetIndex: number, damage: number) => {
    const attacker = gameState.players[attackerIndex];
    const target = gameState.players[targetIndex];
    
    dispatch({ type: 'ATTACK_PLAYER', payload: { attackerIndex, targetIndex, damage } });
    
    if (target.health > damage) {
      toast.warning(`${attacker.name} attacks ${target.name} for ${damage} damage!`);
    } else {
      toast.error(`${attacker.name} defeated ${target.name}!`, {
        description: `${target.name} has died and received a Dead Wizard token. ${attacker.name} receives a Krutagidon Cup!`
      });
    }
  };

  const buyCard = (buyerIndex: number, marketplaceIndex: number, isLegendary: boolean) => {
    const buyer = gameState.players[buyerIndex];
    const marketplace = isLegendary ? gameState.legendaryMarketplace : gameState.marketplace;
    const card = marketplace[marketplaceIndex];
    
    if (buyer.power < card.cost) {
      toast.error(`Not enough power to buy ${card.name}`);
      return;
    }
    
    dispatch({ type: 'BUY_CARD', payload: { buyerIndex, marketplaceIndex, isLegendary } });
    toast.success(`${buyer.name} bought ${card.name}`, {
      description: `The card costs ${card.cost} power and has been added to your discard pile.`
    });
  };

  const endTurn = (playerIndex: number) => {
    dispatch({ type: 'END_TURN', payload: { playerIndex } });
    const nextPlayerIndex = (playerIndex + 1) % gameState.players.length;
    toast(`Player ${playerIndex + 1}'s turn ends. Player ${nextPlayerIndex + 1}'s turn begins!`);
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
        endTurn
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
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
