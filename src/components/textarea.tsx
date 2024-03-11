import * as React from "react";

import { cn } from "../lib/utils";
import Loading, { LoadingSvg } from "./loading";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: boolean;
  loading?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, resize, loading, ...props }) => {
    return (
      <div className="h-full w-full relative">
        <textarea
          className={cn(
            "flex w-full relative rounded-lg bg-background px-3 py-2 text-md focus:border-primary placeholder:text-muted focus-visible:none border-1 !scrollbar-hide",
            resize ? "resize" : "resize-none"
          )}
          {...props}
        />
        {loading && (
          <LoadingSvg className="absolute bottom-2 right-2 w-4 h-4 fill-muted" />
        )}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

export { TextArea };
