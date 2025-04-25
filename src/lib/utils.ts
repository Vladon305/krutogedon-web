import { Player, Position } from "@/hooks/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Функция для получения URL изображения
export const getImageUrl = (path: string): string => {
  try {
    // Используем new URL для создания пути к изображению
    return new URL(`../data/${path}`, import.meta.url).href;
  } catch (err) {
    console.error(`Не удалось загрузить изображение по пути: ${path}`, err);
    return "";
  }
};

export function getRandomElements<T>(array: T[], count: number): T[] {
  // Проверяем, достаточно ли элементов в массиве
  if (array.length < count) {
    throw new Error(`Массив должен содержать как минимум ${count} элементов`);
  }

  // Создаём копию массива
  const shuffled = [...array];

  // Перемешиваем массив (алгоритм Фишера-Йетса)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Меняем элементы местами
  }

  // Возвращаем первые count элементов
  return shuffled.slice(0, count);
}

export function calculatePlayerPositions(
  players: Player[],
  currentUserId: number
): Position[] {
  const radius = 200; // радиус полукруга
  const centerX = window.innerWidth / 2;
  const baseY = 50; // отступ от нижнего края

  const filteredPlayers = players.filter(Boolean);
  const total = filteredPlayers.length;

  const angleStep = Math.PI / (total + 1);

  return filteredPlayers.map((player, index) => {
    if (player.id === currentUserId) {
      // Центр снизу
      return {
        id: player.id,
        left: "50%",
        bottom: `${baseY}px`,
        transform: "translateX(-50%)",
        zIndex: 10,
        player: player,
      };
    }

    // Найдём индекс без текущего пользователя
    const otherPlayers = filteredPlayers.filter((p) => p.id !== currentUserId);
    const otherIndex = otherPlayers.findIndex((p) => p.id === player.id);

    // Расчёт позиции по полукругу
    const angle = Math.PI - angleStep * (otherIndex + 1);
    const x = centerX + radius * Math.cos(angle);
    const y = radius * Math.sin(angle) + baseY;

    return {
      id: player.id,
      left: `${x}px`,
      bottom: `${y}px`,
      player: player,
    };
  });
}

export function getPlayerPositions(
  players: Player[],
  currentPlayerId: number,
  containerWidth: number
): Position[] {
  const PLAYER_WIDTH = 340;
  const PLAYER_HEIGHT = 520;
  const centerX = containerWidth / 2;

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const otherPlayers = players.filter((p) => p.id !== currentPlayerId);
  const otherCount = otherPlayers.length;

  const positions: Position[] = [];

  // Центровка currentPlayer
  if (currentPlayer) {
    positions.push({
      id: currentPlayer.id,
      left: `${centerX - PLAYER_WIDTH / 2}px`,
      bottom: `0px`,
      player: currentPlayer,
    });
  }

  // Спец-логика для 2 игроков
  if (players.length === 2 && otherCount === 1) {
    const offset = PLAYER_WIDTH + 20; // расстояние между игроками
    const left = centerX - offset - PLAYER_WIDTH / 2;

    positions.push({
      id: otherPlayers[0].id,
      left: `${left}px`,
      bottom: `0px`,
      player: otherPlayers[0],
    });

    return positions;
  }

  // Остальные случаи — полукруг
  if (otherCount > 0) {
    const arcAngleDeg = Math.min(160, 40 * otherCount);
    const arcAngleRad = (arcAngleDeg * Math.PI) / 180;
    const angleStep = otherCount > 1 ? arcAngleRad / (otherCount - 1) : 0;
    const startAngle = Math.PI / 2 + arcAngleRad / 2;
    const minArcLength = PLAYER_WIDTH * 1.2 * (otherCount - 1 || 1);
    const radius = Math.max(minArcLength / arcAngleRad, 300);

    otherPlayers.forEach((player, index) => {
      const angle = startAngle - index * angleStep;
      const x = centerX + radius * Math.cos(angle) - PLAYER_WIDTH / 2;
      const y = radius * Math.sin(angle);

      positions.push({
        id: player.id,
        left: `${x}px`,
        bottom: `${y}px`,
        player,
      });
    });
  }

  return positions;
}
