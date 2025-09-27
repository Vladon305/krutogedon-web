import React from "react";
import { Button } from "@/components/ui/button";
import styles from "./GameSetup.module.scss";

interface GameSetupProps {
  onStartGame: () => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const handleStartGame = () => {
    onStartGame();
  };

  return (
    <div className={styles.gameSetup}>
      <div className={styles.gameSetup__panel}>
        <img
          src="/public/lovable-Uploads/e4121de9-0c56-416c-b122-ba926517ceb2.png"
          alt="Krutagidon Logo"
          className={styles.gameSetup__logo}
        />

        <h1 className={styles.gameSetup__title}>
          Extremely Spicy Chipsychosis
        </h1>

        <div className={styles.gameSetup__content}>
          <div className={styles.gameSetup__buttonWrapper}>
            <Button
              onClick={handleStartGame}
              className={styles.gameSetup__startButton}
            >
              Enter The Arena
            </Button>
          </div>

          <div className={styles.gameSetup__description}>
            Prepare for magical chaos, chip-fueled madness, and epic wizard
            battles!
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
