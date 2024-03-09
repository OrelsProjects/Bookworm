import React from "react";
import { cn } from "../lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checkedComponent: React.ReactNode;
  uncheckedComponent: React.ReactNode;
  checked: boolean;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
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
          {checked ? checkedComponent : uncheckedComponent}
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

Checkbox.displayName = "Checkbox";

export { Checkbox };
