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
