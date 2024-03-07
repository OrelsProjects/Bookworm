import * as React from "react";

import { cn } from "../lib/utils";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, resize, ...props }) => {
    return (
      <textarea
        className={cn(
          "flex w-full rounded-lg bg-background px-3 py-2 text-md placeholder:text-muted focus-visible:none border-1 !scrollbar-hide",
          className,
          resize ? "resize" : "resize-none"
        )}
        {...props}
      />
    );
  }
);
TextArea.displayName = "TextArea";

export { TextArea };
