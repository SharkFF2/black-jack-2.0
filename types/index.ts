/**
 * Card interface representing a single playing card
 */
export interface Card {
  suit: "♠" | "♥" | "♦" | "♣";
  rank:
    | "A"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "J"
    | "Q"
    | "K";
  id: string;
}

/**
 * Hand type representing an array of cards
 */
export type Hand = Card[];

/**
 * Game state enum for tracking the current phase of the game
 */
export type GameState = "betting" | "playing" | "dealerTurn" | "gameOver";

/**
 * Chip value type for betting
 */
export type ChipValue = 5 | 10 | 25 | 100 | 500 | 1000 | "ALL IN";
