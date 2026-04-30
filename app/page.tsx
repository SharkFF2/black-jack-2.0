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
  WinningsDisplay,
  LossesDisplay,
  BankruptcyDisplay,
  MainMenu,
} from "./components";

export default function BlackjackGame() {
  const [selectedGame, setSelectedGame] = useState<"menu" | "blackjack">(
    "menu",
  );

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
    showWinnings,
    winnings,
    showLosses,
    losses,
    showBankruptcy,
    placeBet,
    clearBet,
    startGame,
    hit,
    stand,
    double: doubleDown,
    resetGame,
    resetFromBankruptcy,
    hideWinnings,
    hideLosses,
    hideBankruptcy,
  } = useGameLogic();

  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const handleClearBet = () => {
    clearBet();
    setSelectedCard(null);
  };

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };

  const handleHideWinnings = () => {
    hideWinnings();
  };

  const handleHideLosses = () => {
    hideLosses();
  };

  const handleHideBankruptcy = () => {
    hideBankruptcy();
  };

  const handleSelectGame = (game: "blackjack" | "texas-holdem") => {
    if (game === "blackjack") {
      setSelectedGame("blackjack");
    }
  };

  const handleBackToMenu = () => {
    setSelectedGame("menu");
  };

  if (selectedGame === "menu") {
    return <MainMenu onSelectGame={handleSelectGame} />;
  }

  return (
    <div className="game-container">
      <button
        onClick={handleBackToMenu}
        className="back-to-menu-button"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#6366f1",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 100,
        }}
      >
        Back to Menu
      </button>

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

          {gameState === "bankrupt" ? (
            <div className="bankruptcy-controls">
              <button
                onClick={resetFromBankruptcy}
                className="restart-button"
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                Start Fresh Game
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />

      <WinningsDisplay
        show={showWinnings}
        amount={winnings}
        onHide={handleHideWinnings}
      />

      <LossesDisplay
        show={showLosses}
        amount={losses}
        onHide={handleHideLosses}
      />

      <BankruptcyDisplay show={showBankruptcy} onHide={handleHideBankruptcy} />
    </div>
  );
}
