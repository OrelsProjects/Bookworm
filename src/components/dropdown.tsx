import React, { useEffect, useRef } from "react";
import { ExpandType, ExpandingDiv } from "./animationDivs";

export interface DropdownItem {
  label: string;
  leftIcon?: React.ReactNode;
  onClick: () => void;
}

export interface DropdownProps {
  items: DropdownItem[];
  onClose?: () => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  items = [],
  onClose,
  className,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    }

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Detach the event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <ExpandingDiv
      className={`bg-primary-weak rounded-lg flex-col justify-center items-start shadow-xl ${className}`}
      innerRef={dropdownRef}
      expandType={ExpandType.TopLeft}
    >
      {items.map((item) => (
        <div
          key={`dropdown-item-${item.label}`}
          className="w-full h-12 flex items-center justify-start px-4 hover:cursor-pointer hover:bg-primary rounded-lg"
          onClick={() => {
            item.onClick();
            onClose?.();
          }}
        >
          {item.leftIcon && (
            <div className="mr-4 flex items-center justify-center">
              {item.leftIcon}
            </div>
          )}
          <div className="text-foreground">{item.label}</div>
        </div>
      ))}
    </ExpandingDiv>
  );
};

export default Dropdown;
