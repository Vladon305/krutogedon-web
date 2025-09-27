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
import styles from "./AttackModal.module.scss";

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
      <DialogContent className={styles.modalContent}>
        <DialogHeader>
          <DialogTitle className={styles.modalTitle}>
            Attack a Wizard
          </DialogTitle>
        </DialogHeader>

        <div className={styles.body}>
          <div className={styles.description}>
            Select a target and choose damage amount to attack
          </div>

          <div className={styles.targetList}>
            {targets.map((target, index) => (
              <div
                key={`target-${index}`}
                className={`${styles.targetCard} ${
                  selectedTarget === target.id
                    ? styles.targetCard_selected
                    : styles.targetCard_default
                }`}
                onClick={() => setSelectedTarget(target.id)}
              >
                <div className={styles.targetCardInner}>
                  <div className={styles.avatarWithInfo}>
                    <div className={styles.avatar}>
                      {target.username.substring(0, 1)}
                    </div>
                    <div>
                      <div className={styles.username}>{target.username}</div>
                      <div className={styles.health}>
                        Health: {target.health}/{target?.maxHealth}
                      </div>
                    </div>
                  </div>

                  {selectedTarget === target.id && (
                    <div className={styles.checkmark}>✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAttack}
            disabled={selectedTarget === null}
            className={styles.attackButton}
          >
            Attack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttackModal;
