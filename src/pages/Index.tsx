import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 animate-pulse-glow opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-krutagidon-purple to-krutagidon-dark"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-6 text-center">
        <div className="mb-8 animate-float">
          <img
            src="/public/lovable-uploads/e4121de9-0c56-416c-b122-ba926517ceb2.png"
            alt="Krutagidon Logo"
            className="max-w-md w-full mx-auto"
          />
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Krutagidon
        </h1>

        <h2
          className="text-2xl md:text-3xl font-bold mb-8 text-white animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          Extremely Spicy Chipsychosis
        </h2>

        <p
          className="text-xl text-white/80 max-w-2xl mx-auto mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          Enter the arena of Krutagidon, where battle wizards clash in epic
          magical duels fueled by extremely spicy chips. Build your deck, attack
          your enemies, and become the ultimate Krutagidon champion!
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <Link to="/game">
            <Button className="glowing-button text-lg px-8 py-6">
              Start Game
            </Button>
          </Link>

          <Link to="/rules">
            <Button
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Game Rules
            </Button>
          </Link>
        </div>

        <div
          className="mt-8 flex flex-wrap gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "1s" }}
        >
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </Link>

          <Link to="/register">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <UserPlus className="mr-2 h-4 w-4" /> Register
            </Button>
          </Link>

          <Link to="/invite">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Invite Friends
            </Button>
          </Link>

          <Link to="/hand-demo">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Hand Demo
            </Button>
          </Link>
        </div>
      </div>

      <footer className="mt-auto w-full py-4 text-center text-white/50 text-sm">
        <div className="container mx-auto">
          Based on the tabletop card game by Cryptozoic Entertainment
        </div>
      </footer>
    </div>
  );
};

export default Index;
