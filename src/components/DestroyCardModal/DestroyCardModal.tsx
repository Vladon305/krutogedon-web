import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/hooks/types";
import GameCard from "@/components/GameCard/GameCard";

interface DestroyCardModalProps {
  open: boolean;
  onClose: () => void;
  cards: Card[];
  onSelect: (cardId: number) => void;
}

const DestroyCardModal: React.FC<DestroyCardModalProps> = ({
  open,
  onClose,
  cards,
  onSelect,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const handleDestroy = () => {
    if (selectedCardId !== null) {
      onSelect(selectedCardId);
      setSelectedCardId(null);
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => onClose(), 30000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-krutagidon-dark border-krutagidon-purple">
        <DialogHeader>
          <DialogTitle className="text-white">
            Destroy a Card from Discard
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="text-white text-sm">
            Select a card to destroy from your discard pile.
          </div>

          {cards.length === 0 ? (
            <div className="text-white text-sm">No cards in discard pile.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`cursor-pointer transition-all ${
                    selectedCardId === card.id
                      ? "border-yellow-500 border-2"
                      : "border-transparent border-2"
                  }`}
                  onClick={() => setSelectedCardId(card.id)}
                >
                  <GameCard
                    card={card}
                    isInHand={false}
                    className="w-16 h-28"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-krutagidon-red text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDestroy}
            disabled={selectedCardId === null}
            className="bg-gradient-to-r from-krutagidon-purple to-krutagidon-red text-white"
          >
            Destroy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DestroyCardModal;
