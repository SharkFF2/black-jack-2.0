import React from "react";
import { GameState } from "@/types";
import { RotateCcw } from "lucide-react";

interface GameControlsProps {
  gameState: GameState;
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onResetGame: () => void;
}

/**
 * GameControls component - Displays game action buttons based on game state
 */
export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onHit,
  onStand,
  onDouble,
  onResetGame,
}) => {
  return (
    <>
      {gameState === "playing" && (
        <div className="action-buttons">
          <button className="btn btn-hit" onClick={onHit}>
            Hit
          </button>
          <button className="btn btn-stand" onClick={onStand}>
            Stand
          </button>
          <button className="btn btn-double" onClick={onDouble}>
            Double
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
          <button className="btn btn-primary" onClick={onResetGame}>
            <RotateCcw size={20} style={{ marginRight: "0.5rem" }} />
            New Game
          </button>
        </div>
      )}
    </>
  );
};
