import React from "react";
import { Card as CardType } from "@/types";

interface CardDetailModalProps {
  card: CardType | null;
  onClose: () => void;
}

/**
 * CardDetailModal component - Shows detailed information about a card
 */
export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
}) => {
  if (!card) return null;

  const isRed = card.suit === "♥" || card.suit === "♦";
  const suitNames = {
    "♠": "Spades",
    "♥": "Hearts",
    "♦": "Diamonds",
    "♣": "Clubs",
  };
  const rankNames: Record<string, string> = {
    J: "Jack",
    Q: "Queen",
    K: "King",
    A: "Ace",
  };
  const displayRank = rankNames[card.rank] || card.rank;
  const displaySuit = suitNames[card.suit];

  const cardValue = () => {
    if (card.rank === "A") return "11 (or 1)";
    if (["J", "Q", "K"].includes(card.rank)) return "10";
    return card.rank;
  };

  return (
    <div className="card-detail-overlay" onClick={onClose}>
      <div
        className="card-detail-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="card-detail-close" onClick={onClose}>
          ✕
        </button>

        <div className="card-detail-content">
          {/* Centered Card */}
          <div className="card-detail-left">
            <div className={`card-large ${isRed ? "red" : "black"}`}>
              <div className="card-corner top-left">
                <div className="rank">{card.rank}</div>
                <div className="suit">{card.suit}</div>
              </div>
              <div className="card-center-large">{card.suit}</div>
              <div className="card-corner bottom-right">
                <div className="rank">{card.rank}</div>
                <div className="suit">{card.suit}</div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="card-detail-right">
            <h2 className="card-detail-title">
              {displayRank} of {displaySuit}
            </h2>
            <div className="card-detail-info">
              <div className="detail-row">
                <span className="detail-label">Rank:</span>
                <span className="detail-value">{displayRank}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Suit:</span>
                <span className="detail-value">{displaySuit}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Suit Symbol:</span>
                <span
                  className={`detail-value suit-symbol-value ${
                    isRed ? "text-red" : "text-black"
                  }`}
                >
                  {card.suit}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Blackjack Value:</span>
                <span className="detail-value font-bold">{cardValue()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
