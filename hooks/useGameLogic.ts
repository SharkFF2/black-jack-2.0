"use client";

import { useState, useCallback } from "react";
import { Card, GameState, Hand } from "@/types";
import { createDeck } from "@/utils/deck";
import { calculateHandValue } from "@/utils/calculations";

/**
 * Custom hook for managing blackjack game logic
 */
export const useGameLogic = () => {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<Hand>([]);
  const [dealerHand, setDealerHand] = useState<Hand>([]);
  const [playerMoney, setPlayerMoney] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameState, setGameState] = useState<GameState>("betting");
  const [message, setMessage] = useState("Place your bet");
  const [dealerRevealed, setDealerRevealed] = useState(false);

  /**
   * Deal a card from the deck to a hand
   */
  const dealCard = useCallback(
    (hand: Hand): Hand => {
      if (deck.length === 0) {
        const newDeck = createDeck();
        setDeck(newDeck.slice(1));
        return [...hand, newDeck[0]];
      }
      const newCard = deck[0];
      setDeck(deck.slice(1));
      return [...hand, newCard];
    },
    [deck],
  );

  /**
   * Place a bet
   */
  const placeBet = useCallback(
    (amount: number) => {
      if (playerMoney >= amount && gameState === "betting") {
        setCurrentBet((prev) => prev + amount);
        setPlayerMoney((prev) => prev - amount);
      }
    },
    [playerMoney, gameState],
  );

  /**
   * Start a new game by dealing initial cards
   */
  const startGame = useCallback(() => {
    if (currentBet === 0) return;

    setDealerRevealed(false);

    // Deal initial cards (simpler approach with state updates)
    const newDeck = [...deck];
    const p1 = newDeck.pop();
    const d1 = newDeck.pop();
    const p2 = newDeck.pop();
    const d2 = newDeck.pop();

    if (!p1 || !d1 || !p2 || !d2) return;

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
  }, [currentBet, deck]);

  /**
   * Player hits (draws another card)
   */
  const hit = useCallback(() => {
    setPlayerHand((prevHand) => {
      let newHand = prevHand;
      if (deck.length === 0) {
        const newDeck = createDeck();
        setDeck(newDeck.slice(1));
        newHand = [...prevHand, newDeck[0]];
      } else {
        newHand = [...prevHand, deck[0]];
        setDeck(deck.slice(1));
      }

      const value = calculateHandValue(newHand);
      if (value > 21) {
        setMessage("Bust! Dealer wins.");
        setGameState("gameOver");
      } else if (value === 21) {
        setGameState("dealerTurn");
        setDealerRevealed(true);
        setMessage("Dealer's turn...");
        setTimeout(() => {
          playDealerHand(newHand);
        }, 1000);
      }

      return newHand;
    });
  }, [deck]);

  /**
   * Player stands and dealer plays
   */
  const stand = useCallback(
    (hand: Hand = playerHand) => {
      setGameState("dealerTurn");
      setDealerRevealed(true);
      setMessage("Dealer's turn...");

      setTimeout(() => {
        playDealerHand(hand);
      }, 1000);
    },
    [playerHand],
  );

  /**
   * Player doubles down
   */
  const double = useCallback(() => {
    // Check if player can afford to double
    if (playerMoney < currentBet) {
      setMessage("Not enough money to double!");
      return;
    }

    // Double the bet
    setCurrentBet((prev) => prev * 2);
    setPlayerMoney((prev) => prev - currentBet);

    // Deal one more card
    setPlayerHand((prevHand) => {
      let newHand = prevHand;
      if (deck.length === 0) {
        const newDeck = createDeck();
        setDeck(newDeck.slice(1));
        newHand = [...prevHand, newDeck[0]];
      } else {
        newHand = [...prevHand, deck[0]];
        setDeck(deck.slice(1));
      }

      const value = calculateHandValue(newHand);
      if (value > 21) {
        setMessage("Bust! Dealer wins.");
        setGameState("gameOver");
      } else {
        // After doubling, player must stand
        setGameState("dealerTurn");
        setDealerRevealed(true);
        setMessage("Dealer's turn...");

        setTimeout(() => {
          playDealerHand(newHand);
        }, 1000);
      }

      return newHand;
    });
  }, [currentBet, playerMoney, deck]);

  /**
   * Play out the dealer's hand
   */
  const playDealerHand = useCallback(
    (playerCurrentHand: Hand) => {
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
          endGame(playerCurrentHand, currentDealerHand);
        }
      };

      dealerPlay();
    },
    [dealerHand, deck],
  );

  /**
   * End the game and determine winner
   */
  const endGame = useCallback(
    (pHand: Hand, dHand: Hand, playerBlackjack: boolean = false) => {
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

      setPlayerMoney((prev) => prev + winnings);
      setMessage(msg);
    },
    [currentBet],
  );

  /**
   * Reset the game for a new round
   */
  const resetGame = useCallback(() => {
    setPlayerHand([]);
    setDealerHand([]);
    setCurrentBet(0);
    setGameState("betting");
    setMessage("Place your bet");
    setDealerRevealed(false);
    if (deck.length < 20) {
      setDeck(createDeck());
    }
  }, [deck]);

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  return {
    // State
    deck,
    playerHand,
    dealerHand,
    playerMoney,
    currentBet,
    gameState,
    message,
    dealerRevealed,
    playerValue,
    dealerValue,

    // Actions
    dealCard,
    placeBet,
    startGame,
    hit,
    stand,
    double,
    playDealerHand,
    endGame,
    resetGame,
  };
};
