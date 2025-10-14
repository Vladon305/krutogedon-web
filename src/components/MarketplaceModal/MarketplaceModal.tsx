// components/MarketplaceModal.tsx
import React, { useEffect, useState } from "react";
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
import { toast } from "sonner"; // или ваша библиотека для toast уведомлений

interface MarketplaceModalProps {
  open: boolean;
  onClose: () => void;
  marketplace: Card[];
  legendaryMarketplace: Card[];
  strayMagicMarket: Card[];
  playerPower: number;
  gameId: string;
  playerId: string;
  onPurchaseSuccess?: () => void;
}

const MarketplaceModal: React.FC<MarketplaceModalProps> = ({
  open,
  onClose,
  marketplace,
  legendaryMarketplace,
  strayMagicMarket,
  playerPower,
  gameId,
  playerId,
  onPurchaseSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  /**
   * Основная функция покупки карты
   * Реализует логику из game.service.ts метода buyCard
   */
  const handleBuyCard = async (
    cardId: number,
    isLegendary: boolean = false,
    isStrayMagic: boolean = false,
    isFamiliar: boolean = false
  ) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // Находим карту для проверки стоимости
      const card = findCard(cardId, isLegendary, isStrayMagic);
      if (!card) {
        toast.error("Карта не найдена");
        return;
      }

      // Проверяем достаточность мощи
      const cost = isStrayMagic ? 3 : card.cost;
      if (playerPower < cost) {
        toast.error(
          `Недостаточно мощи. Требуется: ${cost}, доступно: ${playerPower}`
        );
        return;
      }

      // Отправляем запрос на покупку карты
      const response = await fetch(`/api/games/${gameId}/buy-card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          isLegendary,
          isStrayMagic,
          isFamiliar,
          playerId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка при покупке карты");
      }

      const result = await response.json();

      toast.success(`Карта "${card.name}" успешно куплена за ${cost} мощи`);

      // Вызываем колбэк для обновления состояния игры
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }

      // Закрываем модальное окно после успешной покупки
      onClose();
    } catch (error) {
      console.error("Ошибка покупки карты:", error);
      toast.error(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Вспомогательная функция для поиска карты в маркетплейсах
   * Соответствует методу findCardInMarket из game.service.ts
   */
  const findCard = (
    cardId: number,
    isLegendary: boolean,
    isStrayMagic: boolean
  ): Card | undefined => {
    if (isLegendary) {
      return legendaryMarketplace.find((c) => c.id === cardId);
    } else if (isStrayMagic) {
      return strayMagicMarket[0]; // Берем верхнюю карту из колоды бродячей магии
    } else {
      return marketplace.find((c) => c.id === cardId);
    }
  };

  /**
   * Проверка возможности покупки карты
   */
  const canBuyCard = (card: Card, isStrayMagic: boolean = false): boolean => {
    const cost = isStrayMagic ? 3 : card.cost;
    return playerPower >= cost && !isProcessing;
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-fit min-w-fit max-h-[90vh] bg-krutagidon-dark border-krutagidon-purple">
        <DialogHeader>
          <DialogTitle className="text-white">Marketplace</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs bg-black/50 rounded-full px-2 py-0.5">
              Available Power: <span className="power-icon">⚡</span>{" "}
              {playerPower}
            </span>
            {isProcessing && (
              <span className="text-xs text-yellow-400">
                Обработка покупки...
              </span>
            )}
          </div>

          <div className="flex space-x-4">
            {/* Обычный маркетплейс */}
            <div className="w-[28rem] max-h-96">
              <Marketplace
                title="Junk Shop"
                cards={marketplace}
                onBuyCard={(cardId: number) =>
                  handleBuyCard(cardId, false, false, false)
                }
                isShowPower={false}
                playerPower={playerPower}
                canBuyCard={(card) => canBuyCard(card, false)}
              />
            </div>

            {/* Легендарный маркетплейс */}
            <div>
              <Marketplace
                title="Legendary Junk Shop"
                cards={legendaryMarketplace}
                onBuyCard={(cardId: number) =>
                  handleBuyCard(cardId, true, false, false)
                }
                isShowPower={false}
                playerPower={playerPower}
                canBuyCard={(card) => canBuyCard(card, false)}
              />
            </div>

            {/* Бродячая магия */}
            <div>
              <Marketplace
                title="Stray Magic"
                cards={strayMagicMarket}
                onBuyCard={(cardId: number) =>
                  handleBuyCard(cardId, false, true, false)
                }
                isShowPower={false}
                playerPower={playerPower}
                isOnlyCard
                canBuyCard={(card) => canBuyCard(card, true)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-krutagidon-red text-white"
            disabled={isProcessing}
          >
            {isProcessing ? "Подождите..." : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceModal;
