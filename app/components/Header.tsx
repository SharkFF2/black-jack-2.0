import React from "react";
import { Coins } from "lucide-react";

interface HeaderProps {
  playerMoney: number;
}

/**
 * Header component - Displays game title and player money
 */
export const Header: React.FC<HeaderProps> = ({ playerMoney }) => {
  return (
    <div className="header">
      <h1 className="title">BLACKJACK</h1>
      <div className="money-display">
        <Coins size={24} color="#fbbf24" />
        <span className="money-amount">${playerMoney}</span>
      </div>
    </div>
  );
};
