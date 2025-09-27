import React, { useEffect } from "react";
import { Card } from "@/hooks/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import styles from "./DefenseModal.module.scss";

interface DefenseModalProps {
  open: boolean;
  onClose: () => void;
  defenseCards: Card[];
  attackData: {
    attackerId: number;
    opponentId: number;
    cardId: number;
    damage: number;
  } | null;
  onDefend: (defenseCardId: number | null) => void;
}

const DefenseModal: React.FC<DefenseModalProps> = ({
  open,
  onClose,
  defenseCards,
  attackData,
  onDefend,
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onDefend(null); // Автоматический пропуск защиты через 30 секунд
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [open, onDefend]);

  if (!open || !attackData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={styles.defenseModal__content}>
        <DialogHeader>
          <DialogTitle className={styles.defenseModal__title}>
            Defend Against Attack
          </DialogTitle>
        </DialogHeader>

        <div className={styles.defenseModal__body}>
          <div className={styles.defenseModal__description}>
            Player {attackData.attackerId} attacks you with {attackData.damage}{" "}
            damage. Choose a defense card or skip.
          </div>

          <div className={styles.defenseModal__cardList}>
            {defenseCards.map((card) => (
              <div
                key={card.id}
                className={styles.defenseModal__card}
                onClick={() => onDefend(card.id)}
              >
                <div className={styles.defenseModal__cardName}>
                  Use {card.name}
                </div>
              </div>
            ))}
            <div
              className={styles.defenseModal__card}
              onClick={() => onDefend(null)}
            >
              <div className={styles.defenseModal__cardName}>Skip Defense</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className={styles.defenseModal__cancelButton}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DefenseModal;
