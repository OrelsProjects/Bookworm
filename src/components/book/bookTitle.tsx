import React from "react";

type TitleProps = {
  title: string;
  className?: string;
  style?: React.CSSProperties;
};

const Title: React.FC<TitleProps> = ({ title, className, style }) => (
  <div className="flex flex-grow w-full">
    <div
      className={`text-sm text-foreground line-clamp-1 flex-1 ${className ?? ""}`}
      style={style}
    >
      {title}
    </div>
  </div>
);

export default Title;
