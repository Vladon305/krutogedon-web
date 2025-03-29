import { Card } from "@/types/game";

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
