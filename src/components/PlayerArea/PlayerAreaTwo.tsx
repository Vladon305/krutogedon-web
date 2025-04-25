// PlayerArea.tsx
import React from "react";
import styles from "./PlayerArea.module.scss";

interface PlayerAreaProps {
  player: { id: string; name: string; isCurrentPlayer: boolean };
  position: "left" | "center" | "right";
  index: number;
  isCurrentPlayer?: boolean;
}

const PlayerArea: React.FC<PlayerAreaProps> = ({
  player,
  position,
  index,
  isCurrentPlayer = false,
}) => {
  // Размеры области игрока
  const playerWidth = 340; // Ширина области игрока в пикселях
  const playerHeight = 520; // Высота области игрока в пикселях

  // Рассчитываем позицию игрока
  let leftPosition = "50%"; // По умолчанию для центрального игрока
  let transform = "translateX(-50%)"; // Центрирование по горизонтали

  if (position === "left") {
    // Игроки слева от центра
    const offset = (index + 1) * (playerWidth + 10); // Смещение влево от центра
    leftPosition = `calc(50% - ${offset}px)`;
    transform = "translateX(0)";
  } else if (position === "right") {
    // Игроки справа от центра
    const offset = (index + 1) * (playerWidth + 10); // Смещение вправо от центра
    leftPosition = `calc(50% + ${offset}px)`;
    transform = "translateX(0)";
  }

  const style = {
    left: leftPosition,
    transform,
    width: `${playerWidth}px`,
    height: `${playerHeight}px`,
  };

  return (
    <div
      className={`${styles.playerArea} ${
        isCurrentPlayer ? styles.currentPlayer : ""
      }`}
      style={style}
    >
      <div className={styles.playerName}>{player.name}</div>
      <div className={styles.cardsZone}>
        <div className={styles.cardPlaceholder}>Карта</div>
        <div className={styles.cardPlaceholder}>Карта</div>
      </div>
      <div className={styles.status}>Здоровье: 20 | Очки: 0</div>
    </div>
  );
};

export default PlayerArea;
