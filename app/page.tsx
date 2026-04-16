"use client";

import React, { useState } from "react";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Card as CardType } from "@/types";
import {
  Header,
  Hand,
  CardDetailModal,
  BettingArea,
  GameControls,
} from "./components";

export default function BlackjackGame() {
  const {
    playerHand,
    dealerHand,
    playerMoney,
    currentBet,
    gameState,
    message,
    dealerRevealed,
    playerValue,
    dealerValue,
    placeBet,
    startGame,
    hit,
    stand,
    double: doubleDown,
    resetGame,
  } = useGameLogic();

  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const handleClearBet = () => {
    setSelectedCard(null);
  };

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };

  return (
    <div className="game-container">
      <div className="game-board">
        <Header playerMoney={playerMoney} />

        <div className="hands-container">
          <Hand
            label="Dealer"
            hand={dealerHand}
            value={dealerValue}
            dealerHidden={!dealerRevealed}
            onCardClick={handleCardClick}
          />

          <Hand
            label="You"
            hand={playerHand}
            value={playerValue}
            onCardClick={handleCardClick}
          />
        </div>

        <div className="controls">
          <div className="message">{message}</div>

          {gameState === "betting" && (
            <BettingArea
              currentBet={currentBet}
              playerMoney={playerMoney}
              onPlaceBet={placeBet}
              onClearBet={handleClearBet}
              onStartGame={startGame}
            />
          )}

          <GameControls
            gameState={gameState}
            onHit={hit}
            onStand={() => stand()}
            onDouble={doubleDown}
            onResetGame={resetGame}
          />
        </div>
      </div>

      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
}
