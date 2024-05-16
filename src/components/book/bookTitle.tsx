import React from "react";

type TitleProps = {
  title: string;
  className?: string;
  style?: React.CSSProperties;
};

const ModalTitle: React.FC<TitleProps> = ({ title, className, style }) => (
  <div className="flex flex-grow w-full">
    <div
      className={`text-xl md:text-5xl text-foreground text-start line-clamp-1 md:line-clamp-2 flex-1 ${className ?? ""}`}
      style={style}
    >
      {title}
    </div>
  </div>
);

export default ModalTitle;
