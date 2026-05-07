import React from "react";
import { Store as StoreIcon } from "lucide-react";

interface StoreProps {
  playerMoney: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const Store: React.FC<StoreProps> = ({
  playerMoney,
  isOpen,
  onOpen,
  onClose,
}) => {
  return (
    <>
      <button
        type="button"
        className="store-button"
        onClick={onOpen}
        aria-label="Open store"
      >
        <StoreIcon size={20} color="#fbbf24" />
      </button>

      {isOpen && (
        <div className="store-overlay">
          <div className="store-modal">
            <div className="store-header">
              <h2>Store</h2>
              <button
                type="button"
                className="store-close-button"
                onClick={onClose}
                aria-label="Close store"
              >
                ×
              </button>
            </div>

            <div className="store-body">
              <div className="store-money-display">
                <span>Your Money</span>
                <strong>${playerMoney}</strong>
              </div>
              <p className="store-placeholder">
                The shop is coming soon. No items are available yet.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
