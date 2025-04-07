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
import GameCard from "./GameCard";

interface TopDeckSelectionModalProps {
  open: boolean;
  onClose: () => void;
  card: Card | null;
  actions: string[];
  onSelect: (action: string) => void;
}

const TopDeckSelectionModal: React.FC<TopDeckSelectionModalProps> = ({
  open,
  onClose,
  card,
  actions,
  onSelect,
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => onClose(), 30000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open || !card) return null;

  const handleAction = (action: string) => {
    onSelect(action);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-krutagidon-dark border-krutagidon-purple">
        <DialogHeader>
          <DialogTitle className="text-white">Select an Action</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="text-white text-sm">Top card of your deck:</div>

          <div className="flex justify-center">
            <GameCard card={card} isInHand={false} className="w-20 h-32" />
          </div>

          <div className="flex gap-2 justify-center">
            {actions.map((action) => (
              <Button
                key={action}
                onClick={() => handleAction(action)}
                className="bg-krutagidon-purple text-white"
              >
                {action === "take"
                  ? "Take"
                  : action === "remove"
                  ? "Remove"
                  : action === "draw"
                  ? "Draw"
                  : "Return"}
              </Button>
            ))}
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

export default TopDeckSelectionModal;
