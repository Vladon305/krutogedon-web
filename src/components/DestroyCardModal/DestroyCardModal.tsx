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
import styles from "./DestroyCardModal.module.scss";

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
      <DialogContent className={styles.destroyCardModal__content}>
        <DialogHeader>
          <DialogTitle className={styles.destroyCardModal__title}>
            Destroy a Card from Discard
          </DialogTitle>
        </DialogHeader>

        <div className={styles.destroyCardModal__body}>
          <div className={styles.destroyCardModal__description}>
            Select a card to destroy from your discard pile.
          </div>

          {cards.length === 0 ? (
            <div className={styles.destroyCardModal__emptyMessage}>
              No cards in discard pile.
            </div>
          ) : (
            <div className={styles.destroyCardModal__cardList}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={
                    styles.destroyCardModal__cardWrapper +
                    ` ${
                      selectedCardId === card.id
                        ? styles.destroyCardModal__cardWrapperSelected
                        : styles.destroyCardModal__cardWrapperDefault
                    }`
                  }
                  onClick={() => setSelectedCardId(card.id)}
                >
                  <GameCard
                    card={card}
                    isInHand={false}
                    className={styles.destroyCardModal__card}
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
            className={styles.destroyCardModal__cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDestroy}
            disabled={selectedCardId === null}
            className={styles.destroyCardModal__destroyButton}
          >
            Destroy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DestroyCardModal;
