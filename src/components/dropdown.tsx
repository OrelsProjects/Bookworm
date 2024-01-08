import React, { useEffect, useRef } from "react";

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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className={`bg-card rounded-lg flex-col justify-center items-start ${className}`}
      ref={dropdownRef}
    >
      {items.map((item) => (
        <div
          key={`dropdown-item-${item.label}`}
          className="w-full h-12 flex items-center justify-start px-4 cursor-pointer hover:bg-primary rounded-lg"
          onClick={item.onClick}
        >
          {item.leftIcon && (
            <div className="mr-4 flex items-center justify-center">
              {item.leftIcon}
            </div>
          )}
          <div className="text-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
