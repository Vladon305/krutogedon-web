import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard/GameCard";
import { ArrowLeft } from "lucide-react";
import { playerAreas } from "@/data/playerAreas";
import { properties } from "@/data/properties";
import { familiars } from "@/data/familiars";
import { cn, getRandomElements } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  Card,
  GameState,
  PlayArea,
  SelectedPlayArea,
  WizardPropertyToken,
} from "@/hooks/types";
import { useAuth } from "@/hooks/useAuth";
import { onSelectionRequired, onSelectionUpdated } from "@/api/socketManager";
import { fetchGame, fetchSelectionOptions } from "@/api/gameApi";
import { updateGameState } from "@/features/game/gameSlice";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./CardSelectionScreen.module.scss";

interface CardSelectionScreenProps {
  socketGameState: GameState;
  onComplete: (selectedItems: {
    property: SelectedPlayArea;
    familiar: Card;
    playerArea: PlayArea;
  }) => void;
}

const CardSelectionScreen: React.FC<CardSelectionScreenProps> = ({
  socketGameState,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [selectedCards, setSelectedCards] = useState<
    Array<Card | SelectedPlayArea | PlayArea>
  >([]);
  const [selectionRequired, setSelectionRequired] = useState(false);
  const [properties, setProperties] = useState<WizardPropertyToken[]>([]);
  const [familiars, setFamiliars] = useState<Card[]>([]);
  const [playerAreas, setPlayerAreas] = useState<PlayArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const game = useSelector((state: RootState) => state.game.currentGame);
  const user = useSelector((state: RootState) => state.auth.user);

  const myPlayer = socketGameState.players.find((p) => p.id === user?.id);
  const allPlayersSelected = socketGameState.players.every(
    (p) => p.selectionCompleted
  );

  const { gameId } = useParams<{ gameId: string }>();

  useEffect(() => {
    onSelectionRequired(({ playerId }) => {
      if (playerId === user?.id.toString()) {
        setSelectionRequired(true);
        fetchOptions();
      }
    });

    onSelectionUpdated(({ playerId: updatedPlayerId }) => {
      if (updatedPlayerId !== user?.id.toString()) {
        fetchOptions();
      }
    });

    if (gameId && user?.id && accessToken && !myPlayer?.selectionCompleted) {
      setSelectionRequired(true);
      fetchOptions();
    }
  }, [gameId, user?.id, accessToken]);

  const fetchOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const options = await fetchSelectionOptions(
        accessToken,
        +gameId,
        user.id.toString()
      );
      setProperties(options.properties);
      setFamiliars(options.familiars);
      setPlayerAreas(options.playerAreas);
    } catch (err) {
      setError("Не удалось загрузить опции выбора. Попробуйте снова.");
      console.error("Error fetching selection options:", err);
    } finally {
      setLoading(false);
    }
  };

  const stepCards = {
    1: properties,
    2: familiars,
    3: playerAreas,
  };

  const stepTitles = {
    1: "Выберите свойство",
    2: "Выберите фамильяра",
    3: "Выберите планшет",
  };

  const handleCardSelect = (card: Card) => {
    const newSelectedCards = [...selectedCards, card];
    setSelectedCards(newSelectedCards);

    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        property: newSelectedCards[0] as SelectedPlayArea,
        familiar: newSelectedCards[1] as Card,
        playerArea: newSelectedCards[2],
      });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setSelectedCards(selectedCards.slice(0, -1));
    }
  };

  if (!game || !socketGameState) {
    fetchGame(accessToken, +gameId)
      .then((fetchedGame) => {
        dispatch(updateGameState(fetchedGame));
      })
      .catch((error) => {
        console.error("Ошибка при загрузке игры:", error);
        setError("Не удалось загрузить игру. Попробуйте снова.");
        navigate(
          `/login?redirect=${encodeURIComponent(
            location.pathname + location.search
          )}`
        );
      });
  }

  if (!selectionRequired || myPlayer?.selectionCompleted) {
    if (myPlayer?.selectionCompleted && !allPlayersSelected) {
      return (
        <div className={styles.cardSelectionScreen}>
          <div className={styles.cardSelectionScreen__panel}>
            <h2 className={styles.cardSelectionScreen__title}>
              Ожидание других игроков...
            </h2>
            <p className={styles.cardSelectionScreen__description}>
              Вы уже выбрали свои карты. Пожалуйста, подождите, пока другие
              игроки завершат выбор.
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  if (loading) {
    return (
      <div className={styles.cardSelectionScreen}>
        <div className={styles.cardSelectionScreen__panel}>
          <h2 className={styles.cardSelectionScreen__title}>
            Загрузка опций...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.cardSelectionScreen}>
        <div className={styles.cardSelectionScreen__panel}>
          <h2 className={styles.cardSelectionScreen__errorTitle}>Ошибка</h2>
          <p className={styles.cardSelectionScreen__description}>{error}</p>
          <Button
            onClick={fetchOptions}
            className={styles.cardSelectionScreen__retryButton}
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cardSelectionScreen}>
      <div className={styles.cardSelectionScreen__panel}>
        <div className={styles.cardSelectionScreen__header}>
          <h2 className={styles.cardSelectionScreen__title}>
            {stepTitles[step as keyof typeof stepTitles]}
          </h2>
          <div className={styles.cardSelectionScreen__stepIndicator}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  styles.cardSelectionScreen__stepDot,
                  s === step && styles.cardSelectionScreen__stepDotActive
                )}
              />
            ))}
          </div>
          <p className={styles.cardSelectionScreen__description}>
            Шаг {step} из 3: Выберите одну карту для вашей стартовой колоды
          </p>
        </div>

        <div className={styles.cardSelectionScreen__cardGrid}>
          {stepCards[step as keyof typeof stepCards].map((card, index) => (
            <div
              key={index}
              className={styles.cardSelectionScreen__cardWrapper}
            >
              <GameCard
                card={card}
                isPlayable={true}
                className={cn(styles.cardSelectionScreen__card, {
                  [styles.cardSelectionScreen__cardFullWidth]:
                    card.type === "property",
                  [styles.cardSelectionScreen__cardPlayerArea]:
                    card.type === "playerArea",
                })}
                onClick={() => handleCardSelect(card)}
              />
            </div>
          ))}
        </div>

        <div className={styles.cardSelectionScreen__footer}>
          {step > 1 ? (
            <Button
              variant="outline"
              className={styles.cardSelectionScreen__backButton}
              onClick={handlePrevStep}
            >
              <ArrowLeft className={styles.cardSelectionScreen__backIcon} />
              Назад
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardSelectionScreen;
