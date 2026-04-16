import { Card } from "@/types";

/**
 * Card suits
 */
export const SUITS = ["♠", "♥", "♦", "♣"] as const;

/**
 * Card ranks
 */
export const RANKS = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
] as const;

/**
 * Creates a standard 52-card deck and shuffles it using the Fisher-Yates algorithm
 * @returns A shuffled array of Card objects
 */
export const createDeck = (): Card[] => {
  const deck: Card[] = [];

  for (let suit of SUITS) {
    for (let rank of RANKS) {
      deck.push({
        suit: suit as Card["suit"],
        rank: rank as Card["rank"],
        id: `${rank}${suit}-${Math.random()}`,
      });
    }
  }

  // Fisher-Yates shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};
