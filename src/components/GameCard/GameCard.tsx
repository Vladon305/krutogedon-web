import React, { useState } from "react";
import { Card as GameCardType } from "@/types/game";
import { cn, getImageUrl } from "@/lib/utils";
import { Card } from "@/hooks/types";
import styles from "./GameCard.module.scss";

interface GameCardProps {
  card: Card;
  onClick?: () => void;
  className?: string;
  isPlayable?: boolean;
  isInHand?: boolean;
  showBack?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  card,
  onClick,
  className,
  isPlayable = true,
  isInHand = false,
  showBack = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isPlayable && onClick) {
      onClick();
    }
  };

  const imageSrc = "http://localhost:5001/uploads/" + card.imageUrl;

  return (
    <>
      {true ? (
        <div
          className={cn(
            styles.gameCard,
            {
              [styles.gameCard__playable]: isPlayable,
              [styles.gameCard__notPlayable]: !isPlayable,
              [styles.gameCard__hovered]: isInHand && isHovered,
            },
            className
          )}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img src={imageSrc} />
        </div>
      ) : (
        <div
          className={cn(
            styles.gameCard,
            {
              [styles.gameCard__playable]: isPlayable,
              [styles.gameCard__notPlayable]: !isPlayable,
              [styles.gameCard__hovered]: isInHand && isHovered,
            },
            className
          )}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={cn(styles.gameCard__inner, {
              [styles.gameCard__innerFlipped]: showBack,
            })}
          >
            <div className={styles.gameCard__front}>
              <div className={styles.gameCard__content}>
                <div className={styles.gameCard__header}>
                  <div className={styles.gameCard__name}>{card.name}</div>
                  <div className={styles.gameCard__cost}>{card.cost}</div>
                </div>

                {card.imageUrl ? (
                  <div className={styles.gameCard__imageContainer}>
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className={styles.gameCard__image}
                    />
                  </div>
                ) : (
                  <div className={styles.gameCard__placeholder}></div>
                )}

                <div className={styles.gameCard__footer}>
                  {card.isAttack && (
                    <div className={styles.gameCard__attackLabel}>
                      ⚔️ ATTACK
                    </div>
                  )}

                  {/* {card.isDefense && (
                    <div className="text-blue-500 font-bold text-xs">
                      🛡️ DEFENSE
                    </div>
                  )}

                  {card.isPermanent && (
                    <div className="text-purple-500 font-bold text-xs">
                      ♾️ PERMANENT
                    </div>
                  )} */}
                </div>
              </div>
            </div>

            {showBack && (
              <div className={styles.gameCard__back}>
                <div className={styles.gameCard__backIcon}>🔮</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GameCard;
