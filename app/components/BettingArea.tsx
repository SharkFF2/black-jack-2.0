import React from "react";
import { Chip } from "./Chip";

interface BettingAreaProps {
  currentBet: number;
  playerMoney: number;
  onPlaceBet: (amount: number) => void;
  onClearBet: () => void;
  onStartGame: () => void;
}

/**
 * BettingArea component - Displays betting chips and controls
 */
export const BettingArea: React.FC<BettingAreaProps> = ({
  currentBet,
  playerMoney,
  onPlaceBet,
  onClearBet,
  onStartGame,
}) => {
  return (
    <div className="betting-area">
      <div className="current-bet">
        Current Bet: <span className="bet-amount">${currentBet}</span>
      </div>
      <div className="chips">
        <Chip
          value={5}
          onClick={() => onPlaceBet(5)}
          disabled={playerMoney < 5}
        />
        <Chip
          value={10}
          onClick={() => onPlaceBet(10)}
          disabled={playerMoney < 10}
        />
        <Chip
          value={25}
          onClick={() => onPlaceBet(25)}
          disabled={playerMoney < 25}
        />
        <Chip
          value={100}
          onClick={() => onPlaceBet(100)}
          disabled={playerMoney < 100}
        />
        <Chip
          value={500}
          onClick={() => onPlaceBet(500)}
          disabled={playerMoney < 500}
        />
        <Chip
          value={1000}
          onClick={() => onPlaceBet(1000)}
          disabled={playerMoney < 1000}
        />
        <Chip
          value={"ALL IN"}
          onClick={() => onPlaceBet(playerMoney)}
          disabled={playerMoney === 0}
        />
      </div>
      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={onStartGame}
          disabled={currentBet === 0}
        >
          Deal Cards
        </button>
        {currentBet > 0 && (
          <button className="btn btn-secondary" onClick={onClearBet}>
            Clear Bet
          </button>
        )}
      </div>
    </div>
  );
};
