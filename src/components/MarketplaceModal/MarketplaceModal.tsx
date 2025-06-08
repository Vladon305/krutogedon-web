// components/DefenseModal.tsx
import React, { useEffect } from "react";
import { Card } from "@/hooks/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Marketplace from "../Marketplace/Marketplace";

interface MarketplaceModalProps {
  open: boolean;
  onClose: () => void;
  marketplace: Card[];
  legendaryMarketplace: Card[];
  strayMagicMarket: Card[];
  playerPower: number;
  handleBuyCard: (cardId: number, isLegendary: boolean) => void;
}

const MarketplaceModal: React.FC<MarketplaceModalProps> = ({
  open,
  onClose,
  marketplace,
  legendaryMarketplace,
  strayMagicMarket,
  playerPower,
  handleBuyCard,
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose(); // Автоматический пропуск защиты через 30 секунд
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-fit min-w-fit bg-krutagidon-dark border-krutagidon-purple">
        <DialogHeader>
          <DialogTitle className="text-white">Marketplace</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <span className="text-xs bg-black/50 rounded-full px-2 py-0.5">
            Available Power: <span className="power-icon">⚡</span>{" "}
            {playerPower}
          </span>
          <div className="flex space-y-2">
            <div>
              <Marketplace
                title="Junk Shop"
                cards={marketplace}
                onBuyCard={(cardId: number) => handleBuyCard(cardId, false)}
                isShowPower={false}
                playerPower={playerPower}
              />
            </div>
            <div>
              <Marketplace
                title="Legendary Junk Shop"
                cards={legendaryMarketplace}
                onBuyCard={(cardId: number) => handleBuyCard(cardId, true)}
                isShowPower={false}
                playerPower={playerPower}
              />
            </div>
            <div>
              <Marketplace
                title="Stray Magic"
                cards={strayMagicMarket}
                onBuyCard={(cardId: number) => handleBuyCard(cardId, true)}
                isShowPower={false}
                playerPower={playerPower}
                isOnlyCard
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-krutagidon-red text-white"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceModal;
