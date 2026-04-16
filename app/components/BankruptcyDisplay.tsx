"use client";

import React, { useEffect, useState } from "react";

interface BankruptcyDisplayProps {
  show: boolean;
  onHide: () => void;
}

export const BankruptcyDisplay: React.FC<BankruptcyDisplayProps> = ({
  show,
  onHide,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after 4 seconds (longer than winnings since user needs to read)
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onHide();
        }, 300); // Allow fade out animation
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-linear-to-r from-red-600 to-red-800 text-white px-12 py-8 rounded-2xl shadow-2xl transform transition-all duration-500 ${
          isVisible ? "scale-100 rotate-0" : "scale-0 rotate-12"
        }`}
      >
        <div className="text-center">
          <div className="text-6xl font-bold mb-2 animate-pulse">BANKRUPT</div>
          <div className="text-2xl font-semibold mb-4">
            You're out of money!
          </div>
          <div className="text-lg opacity-90">
            Click "Start Fresh Game" to try again
          </div>
        </div>
      </div>
    </div>
  );
};
