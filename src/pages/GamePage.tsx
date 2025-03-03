
import React, { useState } from 'react';
import { GameProvider } from '../context/GameContext';
import GameSetup from '../components/GameSetup';
import GameBoard from '../components/GameBoard';

const GamePage: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <GameProvider>
      <div className="min-h-screen">
        {gameStarted ? (
          <GameBoard />
        ) : (
          <GameSetup onStartGame={() => setGameStarted(true)} />
        )}
      </div>
    </GameProvider>
  );
};

export default GamePage;
