import { Card, Hand } from "@/types";

/**
 * Get the blackjack value of a single card
 * @param card - The card to get the value for
 * @returns The numeric value of the card (1-11 for Aces, 10 for face cards, number for others)
 */
export const getCardValue = (card: Card): number => {
  if (card.rank === "A") return 11;
  if (["J", "Q", "K"].includes(card.rank)) return 10;
  return parseInt(card.rank, 10);
};

/**
 * Calculate the total value of a hand, accounting for Aces
 * @param hand - The hand to calculate the value for
 * @returns The calculated hand value (0-21 or higher if bust)
 */
export const calculateHandValue = (hand: Hand): number => {
  let value = 0;
  let aces = 0;

  for (let card of hand) {
    value += getCardValue(card);
    if (card.rank === "A") aces++;
  }

  // Adjust for Aces - convert from 11 to 1 if busting
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
};
