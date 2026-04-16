import React from "react";
import { Hand as HandType, Card as CardType } from "@/types";
import { Card } from "./Card";

interface HandProps {
  label: string;
  hand: HandType;
  value: number;
  dealerHidden?: boolean;
  onCardClick: (card: CardType) => void;
}

/**
 * Hand component - Displays a player or dealer hand
 */
export const Hand: React.FC<HandProps> = ({
  label,
  hand,
  value,
  dealerHidden = false,
  onCardClick,
}) => {
  return (
    <div className="hand">
      <div className="hand-label">
        {label}
        {hand.length > 0 && (
          <span className="hand-value">{dealerHidden ? "?" : value}</span>
        )}
      </div>
      <div className="cards">
        {hand.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            hidden={dealerHidden && i === 1}
            delay={i * 150}
            onClick={(clickedCard) => {
              // Don't allow clicking hidden dealer card
              if (!(dealerHidden && i === 1)) {
                onCardClick(clickedCard);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
