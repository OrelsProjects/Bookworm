import * as React from "react";

import { cn } from "../lib/utils";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, rows, resize, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex h-10 w-full bg-background px-3 py-2 text-md placeholder:text-muted focus-visible:none",
          className,
          resize ? "resize" : "resize-none"
        )}
        {...props}
        rows={rows}
        ref={ref}
      />
    );
  }
);
TextArea.displayName = "TextArea";

export { TextArea };
