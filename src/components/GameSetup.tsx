
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from '../context/GameContext';

interface GameSetupProps {
  onStartGame: () => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const { setupGame } = useGame();
  
  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (count >= 2 && count <= 5) {
      setPlayerCount(count);
    }
  };
  
  const handleStartGame = () => {
    setupGame(playerCount);
    onStartGame();
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-panel p-10 max-w-md w-full animate-fade-in-up">
        <img 
          src="/public/lovable-uploads/e4121de9-0c56-416c-b122-ba926517ceb2.png" 
          alt="Krutagidon Logo" 
          className="w-full max-w-xs mx-auto mb-8 animate-pulse-glow" 
        />
        
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text">
          Extremely Spicy Chipsychosis
        </h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="player-count" className="block text-white font-medium mb-2 text-center">
              Number of Players (2-5)
            </label>
            <Input
              id="player-count"
              type="number"
              min={2}
              max={5}
              value={playerCount}
              onChange={handlePlayerCountChange}
              className="bg-black/50 border-krutagidon-purple text-center text-white"
            />
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleStartGame}
              className="glowing-button w-full py-6 text-lg"
            >
              Enter The Arena
            </Button>
          </div>
          
          <div className="text-center text-white/60 text-sm mt-6">
            Prepare for magical chaos, chip-fueled madness, and epic wizard battles!
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
