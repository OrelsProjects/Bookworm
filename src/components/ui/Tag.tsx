import React from "react";
import { cn } from "../../lib/utils";

export default function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-fit h-6 text-sm sm:text-xs tracking-[0.15px] p-2 flex justify-center items-center rounded-full border-2 border-foreground bg-background",
        className
      )}
    >
      {children}
    </div>
  );
}
