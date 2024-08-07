import React, { useEffect, useRef } from "react";
import { ExpandType } from "../animationDivs";

interface DropdownItem {
  label: string;
  leftIcon?: React.ReactNode;
  position?: number;
  onClick: () => void;
  closeOnClick: boolean;
}

interface DropdownProps {
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
    <div
      key="dropdown"
      className={`bg-card rounded-lg flex-col justify-center items-start shadow-xl ${
        className ?? ""
      }`}
      ref={dropdownRef}
      // expandType={expandType}
    >
      {items
        .sort((a, b) => (a.position || 0) - (b.position || 0))
        .map((item) => (
          <div
            key={`dropdown-item-${item.label}`}
            className="w-full h-12 flex items-center justify-start px-4 transition-all md:hover:bg-slate-400/40 hover:rounded-sm rounded-lg hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
              item.closeOnClick && onClose?.();
            }}
          >
            {item.leftIcon && (
              <div className="mr-2 flex items-center justify-center">
                {item.leftIcon}
              </div>
            )}
            <div className="text-foreground line-clamp-1">{item.label}</div>
          </div>
        ))}
    </div>
  );
};

export default Dropdown;
