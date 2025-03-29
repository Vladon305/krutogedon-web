import Lobby from "@/components/Lobby";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const LobbyPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 animate-pulse-glow opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-krutagidon-purple to-krutagidon-dark"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-4 text-center">
          <Link to="/">
            <Button
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <Home className="mr-2 h-4 w-4" /> На главную
            </Button>
          </Link>
        </div>
        <Lobby />
      </div>
    </div>
  );
};

export default LobbyPage;
