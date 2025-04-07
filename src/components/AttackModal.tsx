import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Player } from "@/hooks/types";

interface AttackModalProps {
  open: boolean;
  onClose: () => void;
  targets: Player[];
  damage?: number;
  onAttack: (targetId: number, damage: number) => void;
}

const AttackModal: React.FC<AttackModalProps> = ({
  open,
  onClose,
  targets,
  damage,
  onAttack,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);

  const handleAttack = () => {
    if (selectedTarget !== null) {
      onAttack(selectedTarget, damage);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-krutagidon-dark border-krutagidon-purple">
        <DialogHeader>
          <DialogTitle className="text-white">Attack a Wizard</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="text-white text-sm">
            Select a target and choose damage amount to attack
          </div>

          <div className="space-y-2">
            {targets.map((target, index) => (
              <div
                key={`target-${index}`}
                className={`p-2 rounded-md cursor-pointer transition-all ${
                  selectedTarget === target.id
                    ? "bg-krutagidon-purple border border-yellow-500"
                    : "bg-gray-800 border border-gray-700 hover:border-gray-500"
                }`}
                onClick={() => setSelectedTarget(target.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-krutagidon-purple border border-white flex items-center justify-center text-white font-bold mr-2">
                      {target.username.substring(0, 1)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {target.username}
                      </div>
                      <div className="text-xs text-gray-400">
                        Health: {target.health}/{target?.maxHealth}
                      </div>
                    </div>
                  </div>

                  {selectedTarget === target.id && (
                    <div className="text-yellow-500">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* <div className="mt-4">
            <label className="text-sm text-white mb-1 block">Damage Amount:</label>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDamageAmount(Math.max(1, damageAmount - 1))}
                className="border-krutagidon-purple text-white"
              >
                -
              </Button>
              <div className="w-12 h-8 flex items-center justify-center rounded bg-black/50 text-white">
                {damageAmount}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDamageAmount(damageAmount + 1)}
                className="border-krutagidon-purple text-white"
              >
                +
              </Button>
            </div>
          </div> */}
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
            onClick={handleAttack}
            disabled={selectedTarget === null}
            className="bg-gradient-to-r from-krutagidon-purple to-krutagidon-red text-white"
          >
            Attack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttackModal;
