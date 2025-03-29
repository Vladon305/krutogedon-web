export type CardType =
  | "sign"
  | "spike"
  | "stick"
  | "legend"
  | "wizard"
  | "creature"
  | "spell"
  | "treasure"
  | "place"
  | "megachaos"
  | "chaos"
  | "familiar"
  | "madmagic"
  | "wilting"
  | "property"
  | "playerArea";

// export type CardRarity = "common" | "uncommon" | "rare" | "legendary";

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  power?: number;
  health?: number;
  description: string;
  effect?: string;
  // rarity: CardRarity;
  imagePath?: string;
  isAttack?: boolean;
  isDefense?: boolean;
  isPermanent?: boolean;
  damage?: number;
  isImageCard: boolean;
}

export interface Player {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  power: number;
  chipsins: number;
  hand: Card[];
  deck: Card[];
  discard: Card[];
  playArea: Card[];
  familiar?: Card;
  deadWizardTokens: number;
  krutagidonCups: number;
  isActive: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentPlayerId: string;
  marketplace: Card[];
  legendaryMarketplace: Card[];
  deadWizardTokensRemaining: number;
  round: number;
  gameOver: boolean;
  winner?: Player;
}

export interface GameAction {
  type: string;
  payload: any;
}
