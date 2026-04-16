"use client";

import React, { useEffect, useState } from "react";

interface WinningsDisplayProps {
  show: boolean;
  amount: number;
  onHide: () => void;
}

export const WinningsDisplay: React.FC<WinningsDisplayProps> = ({
  show,
  amount,
  onHide,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onHide();
        }, 300); // Allow fade out animation
      }, 3000);

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
        className={`bg-linear-to-r from-yellow-400 to-orange-500 text-white px-12 py-8 rounded-2xl shadow-2xl transform transition-all duration-500 ${
          isVisible ? "scale-100 rotate-0" : "scale-0 rotate-12"
        }`}
      >
        <div className="text-center">
          <div className="text-6xl font-bold mb-2 animate-pulse">${amount}</div>
          <div className="text-2xl font-semibold">
            {amount === 0 ? "Push!" : "You Won!"}
          </div>
        </div>
      </div>
    </div>
  );
};
