import * as React from "react";

import { cn } from "../../lib/utils";
import { LoadingSvg } from "./loading";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: boolean;
  loading?: boolean;
  error?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, resize, loading, error, ...props }) => {
    return (
      <div className="h-full w-full relative">
        <textarea
          className={cn(
            "flex h-full w-full relative rounded-lg bg-background px-3 py-2 text-md focus:border-primary placeholder:text-muted focus-visible:none border-1 !scrollbar-hide",
            resize ? "resize" : "resize-none",
            error ? "border-error" : "border-muted",
            // animate background error that fades out
            error ? "animation-error-fade" : "animate-none"
          )}
          {...props}
        />
        {loading && (
          <LoadingSvg
            className={`absolute bottom-2 right-2 w-6 h-6 !fill-muted ${
              props.rows === 1 ? "!w-4 !h-4 !bottom-1 !right-1" : ""
            }`}
          />
        )}
        {/* {error && (
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
        )} */}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

export { TextArea };
