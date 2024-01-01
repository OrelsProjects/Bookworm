"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { TableType } from "./booksTable/booksTable";

interface ToggleButtonProps {
  values: {
    type: TableType;
    label: string;
  }[];
  onToggle: (type: TableType) => void;
}

const ToggleButtons: React.FC<ToggleButtonProps> = ({ values, onToggle }) => {
  const [selected, setSelected] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Update the indicator style whenever the selected index changes
  useEffect(() => {
    const selectedButton = buttonsRef.current[selected];
    if (selectedButton) {
      setIndicatorStyle({
        width: `${selectedButton.offsetWidth}px`,
        height: `${selectedButton.offsetHeight}px`,
        transform: `translateX(${selectedButton.offsetLeft}px)`,
        opacity: 1,
      });
    }
  }, [selected]);

  return (
    <div className="flex bg-secondary p-1 justify-center items-center rounded-full w-fit relative">
      <div
        id="indicator"
        className="absolute left-0 top-1 bottom-0 bg-primary rounded-full transition-all duration-300 ease-in-out"
        style={{ ...indicatorStyle, zIndex: 0 }}
      />
      {values.map((value, index) => {
        return (
          <Button
            key={value.label}
            ref={(el) => (buttonsRef.current[index] = el)}
            variant={selected === index ? "selected" : "secondary"}
            className={`transition-colors duration-250 rounded-full px-4 py-2 relative z-10`}
            onClick={() => {
              setSelected(index);
              onToggle(value.type);
            }}
          >
            {value.label}
          </Button>
        );
      })}
    </div>
  );
};

export default ToggleButtons;
