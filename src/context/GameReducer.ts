import { GameAction, GameState } from "@/types/game";
import { drawCards, generateSampleCards } from "../data/cards";

// Game reducer
export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "SETUP_GAME":
      return action.payload;
    case "START_TURN":
      return {
        ...state,
        currentPlayerIndex: action.payload.playerIndex,
      };
    case "UPDATE_SELECTION_ITEMS":
      const { property, familiar, playerArea, playerId } = action.payload;
      const copyPlayers = [...state.players];
      //   const player = copyPlayers.map((player) => ({
      //     ...player,
      //     property: player.id === playerId && property,
      //     familiar: player.id === playerId && familiar,
      //     playArea: player.id === playerId && playerArea,
      //   }));

      return {
        ...state,
        currentPlayerIndex: action.payload.playerIndex,
      };
    case "PLAY_CARD":
      const { playerIndex, cardIndex } = action.payload;
      const updatedPlayers = [...state.players];
      const player = updatedPlayers[playerIndex];
      const card = player.hand[cardIndex];

      // Remove card from hand
      const newHand = [...player.hand];
      newHand.splice(cardIndex, 1);

      // Add power from sign cards
      if (card.type === "sign" || card.type === "stick") {
        player.power += 1;
      }

      // Add card to play area if it's a permanent
      if (card.isPermanent) {
        player.playArea.push(card);
      } else {
        player.discard.push(card);
      }
      console.log("card", card);
      player.hand = newHand;

      return {
        ...state,
        players: updatedPlayers,
      };
    case "ATTACK_PLAYER":
      const { attackerId, targetId, damage } = action.payload;
      const playersAfterAttack = [...state.players];
      const targetPlayer = playersAfterAttack.find(
        (player) => player.id === targetId
      );

      targetPlayer.health -= damage;

      // Check if player died
      if (targetPlayer.health <= 0) {
        targetPlayer.deadWizardTokens += 1;
        targetPlayer.health = 20; // Resurrect with full health

        // Give attacker a Krutagidon Cup
        playersAfterAttack.find(
          (player) => player.id === attackerId
        ).krutagidonCups += 1;

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
              prev.krutagidonCups > current.krutagidonCups ? prev : current
            ),
          };
        }

        return {
          ...state,
          players: playersAfterAttack,
          deadWizardTokensRemaining: tokensRemaining,
        };
      }

      return {
        ...state,
        players: playersAfterAttack,
      };
    case "BUY_CARD":
      const { buyerIndex, marketplaceIndex, isLegendary } = action.payload;
      const playersAfterBuy = [...state.players];
      const buyer = playersAfterBuy[buyerIndex];

      // Get the marketplace and card
      const marketplace = isLegendary
        ? [...state.legendaryMarketplace]
        : [...state.marketplace];
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
        ? allCards.filter((card) => card.type === "legend")
        : allCards.filter((card) => card.type !== "legend");

      if (eligibleCards.length > 0) {
        const newCard =
          eligibleCards[Math.floor(Math.random() * eligibleCards.length)];
        marketplace.push(newCard);
      }

      // Update the appropriate marketplace
      if (isLegendary) {
        return {
          ...state,
          players: playersAfterBuy,
          legendaryMarketplace: marketplace,
        };
      } else {
        return {
          ...state,
          players: playersAfterBuy,
          marketplace: marketplace,
        };
      }
    case "END_TURN":
      const { playerIndex: currentPlayerIndex, playerId: currentPlayerId } =
        action.payload;
      const playersAfterTurn = [...state.players];
      const currentPlayer = playersAfterTurn.find(
        (player) => player.id === currentPlayerId
      );

      // Discard hand
      currentPlayer.discard = [...currentPlayer.discard, ...currentPlayer.hand];

      // Draw 5 new cards
      const newCards = drawCards(currentPlayer, 5);
      currentPlayer.hand = newCards;

      // Reset power
      currentPlayer.power = 0;

      // Move to next player
      const nextPlayerIndex =
        (currentPlayerIndex + 1) % playersAfterTurn.length;

      // Increment round if we've gone through all players
      const newRound = nextPlayerIndex === 0 ? state.round + 1 : state.round;

      return {
        ...state,
        players: playersAfterTurn,
        currentPlayerIndex: nextPlayerIndex,
        currentPlayerId: playersAfterTurn[nextPlayerIndex].id,
        round: newRound,
      };
    default:
      return state;
  }
};
