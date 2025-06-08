// components/DefenseModal.tsx
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
      <DialogContent className="bg-krutagidon-dark border-krutagidon-purple">
        <DialogHeader>
          <DialogTitle className="text-white">
            Defend Against Attack
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="text-white text-sm">
            Player {attackData.attackerId} attacks you with {attackData.damage}{" "}
            damage. Choose a defense card or skip.
          </div>

          <div className="space-y-2">
            {defenseCards.map((card) => (
              <div
                key={card.id}
                className="p-2 rounded-md cursor-pointer transition-all bg-gray-800 border border-gray-700 hover:border-gray-500"
                onClick={() => onDefend(card.id)}
              >
                <div className="text-sm font-semibold text-white">
                  Use {card.name}
                </div>
              </div>
            ))}
            <div
              className="p-2 rounded-md cursor-pointer transition-all bg-gray-800 border border-gray-700 hover:border-gray-500"
              onClick={() => onDefend(null)}
            >
              <div className="text-sm font-semibold text-white">
                Skip Defense
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-krutagidon-red text-white"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DefenseModal;
