"use client";

import React, { useState, useEffect } from "react";
import { Coins, RotateCcw } from "lucide-react";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = [
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
];

//Creates a standard 52 card deck and shuffles it using the Fisher-Yates algorithm
const createDeck = () => {
  const deck = [];
  for (let suit of SUITS) {
    for (let rank of RANKS) {
      deck.push({ suit, rank, id: `${rank}${suit}-${Math.random()}` });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

const getCardValue = (card) => {
  if (card.rank === "A") return 11;
  if (["J", "Q", "K"].includes(card.rank)) return 10;
  return parseInt(card.rank);
};

const calculateHandValue = (hand) => {
  let value = 0;
  let aces = 0;

  for (let card of hand) {
    value += getCardValue(card);
    if (card.rank === "A") aces++;
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
};

const Card = ({ card, hidden, delay = 0, onClick }) => {
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
      className={`card ${isRed ? "red" : "black"}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
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

/**
 * CardDetailModal component - Shows detailed information about a card
 */
const CardDetailModal = ({ card, onClose }) => {
  if (!card) return null;

  const isRed = card.suit === "♥" || card.suit === "♦";
  const suitNames = {
    "♠": "Spades",
    "♥": "Hearts",
    "♦": "Diamonds",
    "♣": "Clubs",
  };
  const rankNames = {
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

const Chip = ({ value, onClick, disabled }) => {
  const colors = {
    5: "#dc2626",
    10: "#2563eb",
    25: "#16a34a",
    100: "#000000",
    500: "#a855f7",
    1000: "#eab308",
    "ALL IN": "#db2777",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="chip"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${colors[value]}dd, ${colors[value]})`,
        boxShadow: disabled ? "none" : `0 4px 12px ${colors[value]}66`,
      }}
    >
      <div className="chip-inner">
        <div className="chip-value">${value}</div>
      </div>
    </button>
  );
};

export default function BlackjackGame() {
  const [deck, setDeck] = useState(createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerMoney, setPlayerMoney] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameState, setGameState] = useState("betting"); // betting, playing, dealerTurn, gameOver
  const [message, setMessage] = useState("Place your bet");
  const [dealerRevealed, setDealerRevealed] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const dealCard = (hand) => {
    if (deck.length === 0) {
      setDeck(createDeck());
      return hand;
    }
    const newCard = deck[0];
    setDeck(deck.slice(1));
    return [...hand, newCard];
  };

  const placeBet = (amount) => {
    if (playerMoney >= amount && gameState === "betting") {
      setCurrentBet(currentBet + amount);
      setPlayerMoney(playerMoney - amount);
    }
  };

  const startGame = () => {
    if (currentBet === 0) return;

    setDealerRevealed(false);

    // Deal initial cards
    const newDeck = [...deck];
    const p1 = newDeck.pop();
    const d1 = newDeck.pop();
    const p2 = newDeck.pop();
    const d2 = newDeck.pop();

    setDeck(newDeck);
    setPlayerHand([p1, p2]);
    setDealerHand([d1, d2]);
    setGameState("playing");
    setMessage("Hit or Stand?");

    // Check for blackjack
    setTimeout(() => {
      const playerValue = calculateHandValue([p1, p2]);
      if (playerValue === 21) {
        endGame([p1, p2], [d1, d2], true);
      }
    }, 500);
  };

  const hit = () => {
    const newHand = dealCard(playerHand);
    setPlayerHand(newHand);

    const value = calculateHandValue(newHand);
    if (value > 21) {
      setMessage("Bust! Dealer wins.");
      setGameState("gameOver");
    } else if (value === 21) {
      stand(newHand);
    }
  };

  const stand = (hand = playerHand) => {
    setGameState("dealerTurn");
    setDealerRevealed(true);
    setMessage("Dealer's turn...");

    setTimeout(() => {
      playDealerHand(hand);
    }, 1000);
  };

  const playDealerHand = (playerHand) => {
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];

    const dealerPlay = () => {
      const dealerValue = calculateHandValue(currentDealerHand);

      if (dealerValue < 17) {
        setTimeout(() => {
          if (currentDeck.length === 0) {
            currentDeck = createDeck();
          }
          const newCard = currentDeck[0];
          currentDeck = currentDeck.slice(1);
          setDeck(currentDeck);
          currentDealerHand = [...currentDealerHand, newCard];
          setDealerHand(currentDealerHand);
          dealerPlay();
        }, 800);
      } else {
        endGame(playerHand, currentDealerHand);
      }
    };

    dealerPlay();
  };

  const endGame = (pHand, dHand, playerBlackjack = false) => {
    const playerValue = calculateHandValue(pHand);
    const dealerValue = calculateHandValue(dHand);

    setDealerRevealed(true);
    setGameState("gameOver");

    let winnings = 0;
    let msg = "";

    if (playerBlackjack && dealerValue !== 21) {
      winnings = Math.floor(currentBet * 2.5);
      msg = "🎰 BLACKJACK! You win!";
    } else if (playerValue > 21) {
      msg = "💥 Bust! Dealer wins.";
    } else if (dealerValue > 21) {
      winnings = currentBet * 2;
      msg = "🎉 Dealer busts! You win!";
    } else if (playerValue > dealerValue) {
      winnings = currentBet * 2;
      msg = "🎉 You win!";
    } else if (playerValue < dealerValue) {
      msg = "😔 Dealer wins.";
    } else {
      winnings = currentBet;
      msg = "🤝 Push! Bet returned.";
    }

    setPlayerMoney(playerMoney + winnings);
    setMessage(msg);
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setCurrentBet(0);
    setGameState("betting");
    setMessage("Place your bet");
    setDealerRevealed(false);
    if (deck.length < 20) {
      setDeck(createDeck());
    }
  };

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  return (
    <div className="game-container">
      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
      <div className="game-board">
        <div className="header">
          <h1 className="title">BLACKJACK</h1>
          <div className="money-display">
            <Coins size={24} color="#fbbf24" />
            <span className="money-amount">${playerMoney}</span>
          </div>
        </div>

        <div className="hands-container">
          <div className="hand">
            <div className="hand-label">
              Dealer
              {dealerHand.length > 0 && (
                <span className="hand-value">
                  {dealerRevealed ? dealerValue : "?"}
                </span>
              )}
            </div>
            <div className="cards">
              {dealerHand.map((card, i) => (
                <Card
                  key={card.id}
                  card={card}
                  hidden={i === 1 && !dealerRevealed}
                  delay={i * 150}
                  onClick={() =>
                    !(i === 1 && !dealerRevealed) && setSelectedCard(card)
                  }
                />
              ))}
            </div>
          </div>

          <div className="hand">
            <div className="hand-label">
              You
              {playerHand.length > 0 && (
                <span className="hand-value">{playerValue}</span>
              )}
            </div>
            <div className="cards">
              {playerHand.map((card, i) => (
                <Card
                  key={card.id}
                  card={card}
                  delay={i * 150}
                  onClick={() => setSelectedCard(card)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="message">{message}</div>

          {gameState === "betting" && (
            <div className="betting-area">
              <div className="current-bet">
                Current Bet: <span className="bet-amount">${currentBet}</span>
              </div>
              <div className="chips">
                <Chip
                  value={5}
                  onClick={() => placeBet(5)}
                  disabled={playerMoney < 5}
                />
                <Chip
                  value={10}
                  onClick={() => placeBet(10)}
                  disabled={playerMoney < 10}
                />
                <Chip
                  value={25}
                  onClick={() => placeBet(25)}
                  disabled={playerMoney < 25}
                />
                <Chip
                  value={100}
                  onClick={() => placeBet(100)}
                  disabled={playerMoney < 100}
                />
                <Chip
                  value={500}
                  onClick={() => placeBet(500)}
                  disabled={playerMoney < 500}
                />
                <Chip
                  value={1000}
                  onClick={() => placeBet(1000)}
                  disabled={playerMoney < 1000}
                />
                <Chip
                  value={"ALL IN"}
                  onClick={() => placeBet(playerMoney)}
                  disabled={playerMoney === 0}
                />
              </div>
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={startGame}
                  disabled={currentBet === 0}
                >
                  Deal Cards
                </button>
                {currentBet > 0 && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setPlayerMoney(playerMoney + currentBet);
                      setCurrentBet(0);
                    }}
                  >
                    Clear Bet
                  </button>
                )}
              </div>
            </div>
          )}

          {gameState === "playing" && (
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={hit}>
                Hit
              </button>
              <button className="btn btn-secondary" onClick={() => stand()}>
                Stand
              </button>
            </div>
          )}

          {gameState === "dealerTurn" && (
            <div className="action-buttons">
              <button className="btn btn-secondary" disabled>
                Dealer is playing...
              </button>
            </div>
          )}

          {gameState === "gameOver" && (
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={resetGame}>
                <RotateCcw size={20} style={{ marginRight: "0.5rem" }} />
                New Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
