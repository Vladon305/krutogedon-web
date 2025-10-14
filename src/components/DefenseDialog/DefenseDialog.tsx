import React from "react";
import { Card } from "@/hooks/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DefenseDialogProps {
  open: boolean;
  onClose: () => void;
  attackData: {
    attackerId: number;
    opponentId: number;
    cardId: number;
    damage: number;
  } | null;
  defenseCards: Card[];
  onDefend: (cardId: number | null) => void;
  attackerName: string;
}

export const DefenseDialog: React.FC<DefenseDialogProps> = ({
  open,
  onClose,
  attackData,
  defenseCards,
  onDefend,
  attackerName,
}) => {
  const [selectedCardId, setSelectedCardId] = React.useState<number | null>(
    null
  );

  const handleDefend = () => {
    onDefend(selectedCardId);
    setSelectedCardId(null);
    onClose();
  };

  const handleSkip = () => {
    onDefend(null);
    setSelectedCardId(null);
    onClose();
  };

  if (!attackData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Защита от атаки</DialogTitle>
          <DialogDescription>
            {attackerName} атакует вас картой! Урон: {attackData.damage}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-sm font-medium mb-3">
            Выберите защитную карту или пропустите:
          </h3>

          {defenseCards.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              У вас нет защитных карт в руке
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
              {defenseCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedCardId === card.id
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                      : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={"http://localhost:5001/uploads/" + card.imageUrl}
                      alt={card.name}
                      className="flex-1 w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="text-sm font-medium text-center">
                      {card.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Стоимость: {card.cost}
                    </p>
                    {card.defenseProperties.length > 0 && (
                      <div className="mt-1">
                        <p className="text-xs text-blue-600">
                          Защитные свойства: {card.defenseProperties.length}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleSkip}>
            Пропустить
          </Button>
          <Button
            onClick={handleDefend}
            disabled={selectedCardId === null}
            className="ml-2"
          >
            Защититься
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
