import React from "react";
import { Button } from "@/components/ui/button";
import { Game, GameState } from "@/hooks/types";
import styles from "./GameHeader.module.scss";

interface GameHeaderProps {
  gameState: GameState;
  onEndTurn: () => void;
  isCurrentPlayerTurn: boolean;
  actions?: React.ReactNode[];
}

const GameHeader: React.FC<GameHeaderProps> = ({
  gameState,
  onEndTurn,
  isCurrentPlayerTurn,
  actions,
}) => {
  const currentPlayerId = gameState.currentPlayer;
  const currentPlayer = gameState.players.find((p) => p.id === currentPlayerId);

  return (
    <div className={styles.gameHeader}>
      <div className={styles.gameHeader__content}>
        <div className={styles.gameHeader__titleSection}>
          <h1 className={styles.gameHeader__title}>
            Krutagidon: Extremely Spicy Chipsychosis
          </h1>
          <div className={styles.gameHeader__roundInfo}>
            Round: {gameState?.turn}
          </div>
        </div>

        <div className={styles.gameHeader__actions}>
          {actions?.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </div>

        <div className={styles.gameHeader__playerInfo}>
          <div className={styles.gameHeader__playerDetails}>
            <div className={styles.gameHeader__currentPlayer}>
              Current Turn: {currentPlayer.username}
            </div>
            <div className={styles.gameHeader__turnStatus}>
              {isCurrentPlayerTurn ? "Your turn" : "Waiting for your turn..."}
            </div>
          </div>

          {isCurrentPlayerTurn && (
            <Button
              onClick={onEndTurn}
              className={styles.gameHeader__endTurnButton}
            >
              End Turn
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
