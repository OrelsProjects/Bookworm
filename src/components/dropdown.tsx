import React, { useEffect, useRef } from "react";
import { ExpandType, ExpandingDiv } from "./animationDivs";

export interface DropdownItem {
  label: string;
  leftIcon?: React.ReactNode;
  position?: number;
  onClick: () => void;
}

export interface DropdownProps {
  items: DropdownItem[];
  onClose?: () => void;
  className?: string;
  expandType?: ExpandType;
  closeOnSelection?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  items = [],
  onClose,
  className,
  expandType = ExpandType.TopLeft,
  closeOnSelection = true,
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
    if (typeof window === "undefined") return;
    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Detach the event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <ExpandingDiv
      key="dropdown"
      className={`bg-primary-weak rounded-lg flex-col justify-center items-start shadow-xl ${
        className ?? ""
      }`}
      innerRef={dropdownRef}
      expandType={expandType}
    >
      {items
        .sort((a, b) => (a.position || 0) - (b.position || 0))
        .map((item) => (
          <div
            key={`dropdown-item-${item.label}`}
            className="w-full h-12 flex items-center justify-start px-4 hover:cursor-pointer hover:bg-primary rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              item.onClick(); 
              closeOnSelection && onClose?.();
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
