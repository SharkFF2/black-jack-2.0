import React from "react";
import { Card as CardType } from "@/types";

interface CardProps {
  card: CardType;
  hidden?: boolean;
  delay?: number;
  onClick?: (card: CardType) => void;
}

/**
 * Card component - Displays a single playing card
 */
export const Card: React.FC<CardProps> = ({
  card,
  hidden = false,
  delay = 0,
  onClick,
}) => {
  const isRed = card.suit === "♥" || card.suit === "♦";

  if (hidden) {
    return (
      <div className="card card-back" style={{ animationDelay: `${delay}ms` }}>
        <div className="card-pattern"></div>
      </div>
    );
  }

  return (
    <div
      className={`card ${isRed ? "red" : "black"} cursor-pointer hover:scale-110 transition-transform`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick?.(card)}
    >
      <div className="card-corner top-left">
        <div className="rank">{card.rank}</div>
        <div className="suit">{card.suit}</div>
      </div>
      <div className="card-center">{card.suit}</div>
      <div className="card-corner bottom-right">
        <div className="rank">{card.rank}</div>
        <div className="suit">{card.suit}</div>
      </div>
    </div>
  );
};
