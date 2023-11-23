// Toggle.tsx
import React, { useState } from "react";

interface ToggleProps {
  onToggle?: (state: boolean) => void;
  default?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
  onToggle,
  default: initialState = false,
}) => {
  const [isToggled, setIsToggled] = useState(initialState);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    if (onToggle) {
      onToggle(!isToggled);
    }
  };

  return (
    <button
      className={`relative w-12 h-6 bg-gray-300 rounded-full focus:outline-none transition-all duration-300 ${
        isToggled ? "bg-green-400" : ""
      }`}
      onClick={handleToggle}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
          isToggled ? "transform translate-x-6" : ""
        }`}
      ></span>
    </button>
  );
};

export default Toggle;
