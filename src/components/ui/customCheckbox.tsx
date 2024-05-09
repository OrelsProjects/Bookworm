"use client";
import React from "react";
import { cn } from "../../lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checkedComponent?: React.ReactNode;
  uncheckedComponent?: React.ReactNode;
  checked: boolean;
  error?: string;
}

const defaultCheckedComponent = (
  <div className="w-4 h-4 flex justify-center items-center bg-blue-600 rounded">
    {/* SVG icon for checkmark */}
    <svg
      className="w-3 h-3 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);
const defaultUncheckedComponent = (
  <div className="w-4 h-4 bg-muted border-foreground rounded"></div>
);

const CustomCheckbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checkedComponent,
      uncheckedComponent,
      error,
      checked,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full h-full flex items-center">
        <input
          type="checkbox"
          className="opacity-0 absolute h-0 w-0"
          ref={ref}
          checked={checked}
          {...props}
        />
        <div className={cn("cursor-pointer", className)}>
          {checked
            ? checkedComponent ?? defaultCheckedComponent
            : uncheckedComponent ?? defaultUncheckedComponent}
        </div>
        {error && (
          <div className="flex items-center ml-2">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

export default CustomCheckbox;
