
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import PlayerArea from './PlayerArea';
import Marketplace from './Marketplace';
import GameHeader from './GameHeader';
import AttackModal from './AttackModal';
import { Player } from '../types/game';

const GameBoard: React.FC = () => {
  const { gameState, playCard, attackPlayer, buyCard, endTurn } = useGame();
  const [attackModalOpen, setAttackModalOpen] = useState(false);
  const [attackingPlayerIndex, setAttackingPlayerIndex] = useState(0);
  
  const currentPlayerIndex = gameState.currentPlayerIndex;
  const currentPlayer = gameState.players[currentPlayerIndex];
  
  const handlePlayCard = (cardIndex: number) => {
    playCard(currentPlayerIndex, cardIndex);
  };
  
  const handleAttackModalOpen = (attackerIndex: number) => {
    setAttackingPlayerIndex(attackerIndex);
    setAttackModalOpen(true);
  };
  
  const handleAttack = (targetIndex: number, damage: number) => {
    attackPlayer(attackingPlayerIndex, targetIndex, damage);
  };
  
  const handleBuyCard = (marketplaceIndex: number, isLegendary: boolean) => {
    buyCard(currentPlayerIndex, marketplaceIndex, isLegendary);
  };
  
  const handleEndTurn = () => {
    endTurn(currentPlayerIndex);
  };
  
  // Filter out current player for attack targets
  const attackTargets = gameState.players.filter((_, index) => index !== attackingPlayerIndex);
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <GameHeader
        gameState={gameState}
        onEndTurn={handleEndTurn}
        isCurrentPlayerTurn={true} // In a real game, we'd check if it's the client player's turn
      />
      
      {gameState.gameOver ? (
        <div className="glass-panel p-8 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-yellow-500 mb-4">Game Over!</h2>
          <p className="text-white text-xl mb-6">
            {gameState.winner?.name} wins with {gameState.winner?.krutagidonCups} Krutagidon Cups!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {gameState.players.map((player, index) => (
              <div 
                key={`result-${index}`}
                className={`glass-panel p-4 ${player.id === gameState.winner?.id ? 'border-yellow-500 shadow-neon' : ''}`}
              >
                <h3 className="text-white font-bold mb-2 flex items-center">
                  {player.name} 
                  {player.id === gameState.winner?.id && (
                    <span className="ml-2 text-yellow-500">👑</span>
                  )}
                </h3>
                <div className="text-white/70 text-sm">
                  Krutagidon Cups: {player.krutagidonCups}
                </div>
                <div className="text-white/70 text-sm">
                  Dead Wizard Tokens: {player.deadWizardTokens}
                </div>
                <div className="text-white/70 text-sm">
                  Cards in Collection: {player.deck.length + player.discard.length + player.hand.length + player.playArea.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameState.players.map((player, index) => (
                  <PlayerArea
                    key={`player-${index}`}
                    player={player}
                    isCurrentPlayer={index === currentPlayerIndex}
                    onPlayCard={handlePlayCard}
                    onAttackPlayer={() => handleAttackModalOpen(index)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <Marketplace
                title="Junk Shop"
                cards={gameState.marketplace}
                onBuyCard={(index) => handleBuyCard(index, false)}
                playerPower={currentPlayer.power}
              />
              
              <Marketplace
                title="Legendary Junk Shop"
                cards={gameState.legendaryMarketplace}
                onBuyCard={(index) => handleBuyCard(index, true)}
                playerPower={currentPlayer.power}
              />
            </div>
          </div>
        </>
      )}
      
      <AttackModal
        open={attackModalOpen}
        onClose={() => setAttackModalOpen(false)}
        attacker={gameState.players[attackingPlayerIndex]}
        targets={attackTargets}
        onAttack={handleAttack}
      />
    </div>
  );
};

export default GameBoard;
