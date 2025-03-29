export interface Card {
  id: number;
  name: string;
  cost: number;
  attack: number;
  life: number;
  effect: string;
  properties: string[];
  damage: number;
  isAttack: boolean;
  type?: "property" | "familiar" | "playerArea";
}

export interface Player {
  id: number;
  userId: string;
  username: string;
  deck: Card[];
  hand: Card[];
  discard: Card[];
  life: number;
  power: number;
  krutagidonCups: number;
  deadWizardTokens: number;
  playArea: Card[];
  selectionCompleted: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  turn: number;
  status: "pending" | "active" | "finished";
  winner?: Player;
  marketplace: Card[];
  legendaryMarketplace: Card[];
  gameOver: boolean;
}

export interface Game {
  id: number;
  players: { id: number; username: string }[];
  gameState: GameState;
  currentTurn: number;
  currentTurnIndex: number;
}
