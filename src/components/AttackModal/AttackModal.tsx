import React, { useState, useEffect } from "react";
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
  onAttack: (targetId: number) => void;
}

const AttackModal: React.FC<AttackModalProps> = ({
  open,
  onClose,
  targets,
  damage = 0,
  onAttack,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);

  // Сбросить выбранную цель при открытии/закрытии модального окна
  useEffect(() => {
    if (open) {
      setSelectedTarget(null);
      console.log("Attack modal opened, targets:", targets);
    }
  }, [open, targets]);

  const handleAttack = () => {
    if (selectedTarget !== null) {
      console.log("Attacking target:", selectedTarget);
      onAttack(selectedTarget);
      // Не закрываем модальное окно здесь - это сделает родительский компонент
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
            Select a target to attack {damage > 0 && `(${damage} damage)`}
          </div>

          {targets.length === 0 ? (
            <div className={styles.noTargets}>
              No available targets for attack
            </div>
          ) : (
            <div className={styles.targetList}>
              {targets.map((target) => (
                <div
                  key={`target-${target.id}`}
                  className={`${styles.targetCard} ${
                    selectedTarget === target.id
                      ? styles.targetCard_selected
                      : styles.targetCard_default
                  }`}
                  onClick={() => {
                    console.log("Selected target:", target.id);
                    setSelectedTarget(target.id);
                  }}
                >
                  <div className={styles.targetCardInner}>
                    <div className={styles.avatarWithInfo}>
                      <div className={styles.avatar}>
                        {target.username.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.username}>{target.username}</div>
                        <div className={styles.health}>
                          Health: {target.health}/{target.maxHealth}
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
          )}
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
            disabled={selectedTarget === null || targets.length === 0}
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
