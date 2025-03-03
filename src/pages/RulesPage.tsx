
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const RulesPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:text-white/80">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="glass-panel p-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text">
            Game Rules: Krutagidon - Extremely Spicy Chipsychosis
          </h1>
          
          <div className="space-y-8 text-white">
            <section>
              <h2 className="text-xl font-bold mb-4 text-yellow-500">Overview</h2>
              <p>
                Krutagidon is a deck-building card game where wizards battle to collect Krutagidon Cups by defeating opponents. Build your deck with powerful cards, attack your enemies, and be the last wizard standing!
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 text-yellow-500">Game Setup</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Each player starts with 20 health points.</li>
                <li>Each player begins with a starter deck containing 6 Sign cards, 3 Spike cards, and 1 Cheese Stick card.</li>
                <li>The marketplace (Junk Shop) is filled with 5 randomly selected cards.</li>
                <li>The legendary marketplace (Legendary Junk Shop) is filled with 3 legendary cards.</li>
                <li>The game uses Dead Wizard Tokens equal to the number of players plus 4.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 text-yellow-500">Game Flow</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>The game is played in rounds, with each player taking one turn per round.</li>
                <li>On your turn, you draw 5 cards from your deck.</li>
                <li>You can play cards from your hand to gain power, attack other players, or trigger special effects.</li>
                <li>Sign cards generate 1 power each, which can be used to purchase new cards.</li>
                <li>You can purchase cards from the Junk Shop or Legendary Junk Shop using your power.</li>
                <li>At the end of your turn, you discard your hand and draw 5 new cards.</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 text-yellow-500">Death and Resurrection</h2>
              <p className="mb-4">
                When a player's health reaches 0, they receive a Dead Wizard Token and the attacking player receives a Krutagidon Cup. The defeated player is then resurrected with 20 health.
              </p>
              <p>
                The game ends when either all Dead Wizard Tokens have been distributed or when a marketplace cannot be refilled. The player with the most Krutagidon Cups is the winner!
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 text-yellow-500">Card Types</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Signs</strong>: Generate 1 power each.</li>
                <li><strong>Spikes</strong>: No effect, try to get rid of them!</li>
                <li><strong>Creatures</strong>: Can attack other players or provide ongoing benefits.</li>
                <li><strong>Spells</strong>: One-time effects that can deal damage or provide other benefits.</li>
                <li><strong>Treasures</strong>: Provide special abilities or resources.</li>
                <li><strong>Places</strong>: Permanent cards that provide ongoing effects.</li>
                <li><strong>Legends</strong>: Powerful cards that combine multiple card types.</li>
              </ul>
            </section>
            
            <div className="mt-8 flex justify-center">
              <Link to="/game">
                <Button className="glowing-button">
                  Start Playing Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
