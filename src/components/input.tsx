import * as React from "react";

import { cn } from "../lib/utils";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="relative w-full h-full">
        <input
          key={`${props.id}-key`}
          name={props.name}
          id={props.id}
          type={type}
          className={cn(
            "flex h-10 bg-background px-3 py-2 text-md placeholder:text-muted focus-visible:none truncate",
            error ? "border-1 border-error" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <div className="absolute left-0 pr-3 flex items-center pointer-events-none mt-1">
            <svg
              className="h-5 w-5 text-error"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error && <p className="text-sm text-error">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
