import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Card } from "@/hooks/types";
import styles from "./CardPreviewModal.module.scss";

interface CardPreviewModalProps {
  card: Card | null;
  open: boolean;
  onClose: () => void;
}

const CardPreviewModal: React.FC<CardPreviewModalProps> = ({
  card,
  open,
  onClose,
}) => {
  if (!card) return null;

  const imageSrc = "http://localhost:5001/uploads/" + card.imageUrl;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogPortal>
        {/* Кастомный overlay с высоким z-index только для CardPreview */}
        <DialogOverlay className={styles.cardPreviewModal__overlay} />

        <DialogContent
          className={styles.cardPreviewModal}
          onClick={onClose}
        >
          {/* Скрытый заголовок для accessibility */}
          <VisuallyHidden>
            <DialogTitle>{card.name}</DialogTitle>
          </VisuallyHidden>

          <div className={styles.cardPreviewModal__imageWrapper}>
            <img
              src={imageSrc}
              alt={card.name}
              className={styles.cardPreviewModal__image}
            />
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CardPreviewModal;
