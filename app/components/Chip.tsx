import React from "react";
import { ChipValue } from "@/types";

interface ChipProps {
  value: ChipValue;
  onClick: () => void;
  disabled: boolean;
}

/**
 * Chip component - Betting chip button
 */
export const Chip: React.FC<ChipProps> = ({ value, onClick, disabled }) => {
  const colors: Record<ChipValue, string> = {
    5: "#dc2626",
    10: "#2563eb",
    25: "#16a34a",
    100: "#000000",
    500: "#a855f7",
    1000: "#eab308",
    "ALL IN": "#db2777",
  };

  const chipColor = colors[value];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="chip"
      style={{
        background: disabled
          ? "#ccc"
          : `radial-gradient(circle at 30% 30%, ${chipColor}dd, ${chipColor})`,
        boxShadow: disabled ? "none" : `0 4px 12px ${chipColor}66`,
      }}
    >
      <div className="chip-inner">
        <div className="chip-value">
          {value === "ALL IN" ? "ALL IN" : `$${value}`}
        </div>
      </div>
    </button>
  );
};
