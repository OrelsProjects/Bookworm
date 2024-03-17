import React, { useMemo } from "react";

interface ReadMoreTextProps {
  text?: string | null;
  maxLines: 1 | 2 | 3 | 4 | 5 | 6;
  collapseDefault?: boolean;
  className?: string;
}

const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  text,
  maxLines,
  collapseDefault = true,
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapseDefault);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const maxLinesClass = useMemo(() => {
    switch (maxLines) {
      case 1:
        return "line-clamp-1";
      case 2:
        return "line-clamp-2";
      case 3:
        return "line-clamp-3";
      case 4:
        return "line-clamp-4";
      case 5:
        return "line-clamp-5";
      case 6:
        return "line-clamp-6";
    }
  }, [maxLines]);

  return (
    text && (
      <div>
        <p
          className={`${
            isCollapsed ? maxLinesClass : ""
          } text-text-muted text-md ${className}`}
        >
          {text}
        </p>
        <button
          className="text-foreground font-bold underline"
          onClick={toggleCollapse}
        >
          {isCollapsed ? "Read more" : "Read less"}
        </button>
      </div>
    )
  );
};

export default ReadMoreText;
