import React from "react";
import GameCard from "@/components/GameCard/GameCard";
import { Card } from "@/hooks/types";
import styles from "./DiscardDeck.module.scss";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  discard: Card[];
  onClickOpen: () => void;
  onClose: () => void;
};

const DiscardDeck = ({ isOpen, discard, onClickOpen, onClose }: Props) => {
  const lastCard = discard[discard.length - 1];
  console.log("lastCard", lastCard);
  return (
    <>
      <div className={styles.discardDeck}>
        <div className={styles.discardDeck__content}>
          <div className={styles.discardDeck__label}>Discard</div>
          <div
            className={styles.discardDeck__cardContainer}
            onClick={onClickOpen}
          >
            {lastCard && (
              <GameCard
                className={styles.discardDeck__card}
                card={lastCard}
                isPlayable={false}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Сброс ({discard.length} карт)</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-4">
            {discard.length === 0 ? (
              <p className="text-muted-foreground col-span-3 text-center">
                Сброс пуст
              </p>
            ) : (
              discard.map((card, index) => (
                <div key={`discard-${index}`} className="flex justify-center">
                  <GameCard card={card} isPlayable={false} />
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DiscardDeck;
