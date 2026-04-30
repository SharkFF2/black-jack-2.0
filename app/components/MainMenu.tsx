import React from "react";

interface MainMenuProps {
  onSelectGame: (game: "blackjack" | "texas-holdem") => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="main-menu-container">
      <div className="main-menu">
        <h1 className="main-menu-title">Card Games</h1>
        <p className="main-menu-subtitle">Choose a game to play</p>

        <div className="menu-buttons">
          <button
            onClick={() => onSelectGame("blackjack")}
            className="menu-button blackjack-button"
          >
            <span className="button-icon">♠️</span>
            <span className="button-text">BlackJack</span>
          </button>

          <button
            onClick={() => onSelectGame("texas-holdem")}
            className="menu-button texas-holdem-button"
            disabled
            title="Coming soon"
          >
            <span className="button-icon">♣️</span>
            <span className="button-text">Texas Holdem</span>
            <span className="coming-soon">Coming Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
};
