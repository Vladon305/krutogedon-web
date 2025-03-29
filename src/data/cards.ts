import { Card, CardType, Player } from "../types/game";

// Starter cards
export const signCard: Card = {
  id: "sign-base",
  name: "Sign",
  type: "sign",
  cost: 0,
  description: "+1 Power",
  rarity: "common",
  imagePath: "assets/seed/IMG_8152_processed.png",
  isImageCard: true,
};

export const spikeCard: Card = {
  id: "spike-base",
  name: "Spike",
  type: "spike",
  cost: 0,
  description: "No effect. Get rid of it!",
  rarity: "common",
  imagePath: "assets/seed/IMG_8154_processed.png",
  isImageCard: true,
};

export const StickCard: Card = {
  id: "stick-base",
  name: "Stick",
  type: "stick",
  cost: 0,
  damage: 1,
  description:
    "Attack: Deal 1 damage to a wizard. If they die from this damage, get 2 chipsins.",
  isAttack: true,
  rarity: "common",
  imagePath: "assets/seed/IMG_8155_processed.png",
  isImageCard: true,
};

// Generate sample cards for each type
export const generateSampleCards = (): Card[] => {
  const cards: Card[] = [];

  // Generate some regular marketplace cards
  cards.push({
    id: "wiz-1",
    name: "Wizard Channeler",
    type: "wizard",
    cost: 7,
    power: 2,
    description: "Gain +1 power for each spell you play this turn.",
    rarity: "uncommon",
    imagePath:
      "/public/lovable-uploads/effbae94-7ebe-4cf0-9abf-00be5d69bb06.png",
    isImageCard: false,
  });

  cards.push({
    id: "creature-1",
    name: "Brutal Force",
    type: "creature",
    cost: 5,
    power: 3,
    health: 2,
    description: "Attack: Deal 3 damage to a target wizard.",
    isAttack: true,
    rarity: "common",
    imagePath:
      "/public/lovable-uploads/817cf14b-b0eb-4fdc-b95f-372db16e6dd4.png",
    isImageCard: false,
  });

  cards.push({
    id: "spell-1",
    name: "Brain Drain",
    type: "spell",
    cost: 5,
    description: "Attack: Deal 5 damage to target wizard.",
    isAttack: true,
    rarity: "common",
    imagePath:
      "/public/lovable-uploads/69f41f8c-14f5-4db4-8f4a-ea4f7abee603.png",
    isImageCard: false,
  });

  cards.push({
    id: "treasure-1",
    name: "Stick Totem",
    type: "treasure",
    cost: 4,
    description:
      "You may destroy this treasure to destroy a card in your hand.",
    rarity: "uncommon",
    imagePath:
      "/public/lovable-uploads/bb438b32-f1f1-4c30-af7a-0ac597ec4beb.png",
    isImageCard: false,
  });

  cards.push({
    id: "place-1",
    name: "Creator's Tower",
    type: "place",
    cost: 6,
    description: "Permanent: At the end of your turn, draw an additional card.",
    isPermanent: true,
    rarity: "uncommon",
    imagePath:
      "/public/lovable-uploads/fd1ab9b9-d82b-4833-a287-643727706297.png",
    isImageCard: false,
  });

  // Generate some legendary cards
  cards.push({
    id: "legend-1",
    name: "Evil Villain",
    type: "legend",
    cost: 19,
    power: 10,
    description:
      "Attack: The targeted wizard takes 7 damage and discards a card. This card cannot be countered.",
    isAttack: true,
    rarity: "legendary",
    imagePath:
      "/public/lovable-uploads/047faeba-79a0-4136-bb23-f5c196a05fef.png",
    isImageCard: false,
  });

  cards.push({
    id: "legend-2",
    name: "Evil Villain",
    type: "legend",
    cost: 19,
    power: 10,
    description:
      "Attack: The targeted wizard takes 7 damage and discards a card. This card cannot be countered.",
    isAttack: true,
    rarity: "legendary",
    imagePath:
      "/public/lovable-uploads/047faeba-79a0-4136-bb23-f5c196a05fef.png",
    isImageCard: false,
  });

  cards.push({
    id: "megachaos-1",
    name: "Mega Chaos",
    type: "megachaos",
    cost: 0,
    description:
      "Chaos Event: All wizards must discard their hands and draw 3 new cards.",
    rarity: "rare",
    imagePath:
      "/public/lovable-uploads/be4e74ef-bf71-443b-8f63-6f989ead785f.png",
    isImageCard: false,
  });

  cards.push({
    id: "familiar-1",
    name: "Bookworm",
    type: "familiar",
    cost: 6,
    description:
      "Defense: Discard a card to avoid an attack. Each time you draw a card, gain 1 power.",
    isDefense: true,
    rarity: "uncommon",
    imagePath:
      "/public/lovable-uploads/4cb2abb3-b1e8-40f2-9a50-9f817ec6d7ba.png",
    isImageCard: false,
  });

  cards.push({
    id: "madmagic-1",
    name: "Mad Magic",
    type: "madmagic",
    cost: 3,
    description:
      "Choose one: Gain 2 power or draw a card from your opponent's deck.",
    rarity: "uncommon",
    imagePath:
      "/public/lovable-uploads/4d70a1f5-ee1d-43c2-a8c6-2bc34a7d24a8.png",
    isImageCard: false,
  });

  cards.push({
    id: "wilting-1",
    name: "Wilting",
    type: "wilting",
    cost: 0,
    description:
      "No effect. At the end of the game, lose 1 victory point for each wilting in your deck.",
    rarity: "common",
    imagePath:
      "/public/lovable-uploads/2f5c74c1-6bc3-4c47-980f-c28bd3cfde96.png",
    isImageCard: false,
  });

  return cards;
};

// Generate starter deck
export const generateStarterDeck = (): Card[] => {
  const deck: Card[] = [];

  // Add 6 signs
  for (let i = 0; i < 6; i++) {
    deck.push({ ...signCard, id: `sign-${i}` });
  }

  // Add 1 cheese stick
  deck.push({ ...StickCard, id: "stick-0" });

  // Add 3 spikes
  for (let i = 0; i < 3; i++) {
    deck.push({ ...spikeCard, id: `spike-${i}` });
  }

  return deck;
};

// Helper function to draw cards
export const drawCards = (player: Player, count: number): Card[] => {
  const cards: Card[] = [];

  for (let i = 0; i < count; i++) {
    // If deck is empty, shuffle discard pile into deck
    if (player.deck.length === 0) {
      if (player.discard.length === 0) {
        break; // No more cards to draw
      }

      // Shuffle discard pile
      const shuffledDiscard = [...player.discard].sort(
        () => Math.random() - 0.5
      );
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
