import React from "react";
import { cn } from "../lib/utils";

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checkedComponent?: React.ReactNode;
  uncheckedComponent?: React.ReactNode;
  checked: boolean;
  error?: string;
}

const defaultCheckedComponent = (
  <input
    id="inline-checkbox"
    type="checkbox"
    checked
    className="w-4 h-4 text-blue-600 bg-muted border-gray-300 rounded focus:ring-blue-500"
  />
);
const defaultUncheckedComponent = (
  <input
    id="inline-checkbox"
    type="checkbox"
    checked={false}
    className="w-4 h-4 text-blue-600 bg-muted border-gray-300 rounded focus:ring-blue-500"
  />
);

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

Checkbox.displayName = "Checkbox";

export { Checkbox };
