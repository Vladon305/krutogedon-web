import React, { createContext, useContext, useState, ReactNode } from "react";
import { Card } from "@/hooks/types";

interface CardPreviewContextType {
  selectedCard: Card | null;
  showCardPreview: (card: Card) => void;
  hideCardPreview: () => void;
}

const CardPreviewContext = createContext<CardPreviewContextType | undefined>(
  undefined
);

export const useCardPreview = () => {
  const context = useContext(CardPreviewContext);
  if (!context) {
    throw new Error(
      "useCardPreview must be used within a CardPreviewProvider"
    );
  }
  return context;
};

interface CardPreviewProviderProps {
  children: ReactNode;
}

export const CardPreviewProvider: React.FC<CardPreviewProviderProps> = ({
  children,
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const showCardPreview = (card: Card) => {
    setSelectedCard(card);
  };

  const hideCardPreview = () => {
    setSelectedCard(null);
  };

  return (
    <CardPreviewContext.Provider
      value={{ selectedCard, showCardPreview, hideCardPreview }}
    >
      {children}
    </CardPreviewContext.Provider>
  );
};
