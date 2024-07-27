import React from "react";

type AuthorsProps = {
  authors?: string[];
  prefix?: string;
  className?: string;
  style?: React.CSSProperties;
};

const ModalAuthors: React.FC<AuthorsProps> = ({
  authors,
  prefix,
  className,
  style,
}) => (
  <div className="flex flex-grow">
    <div
      className={`text-muted/70 text-lg text-start font-normal flex-1 line-clamp-1 ${className ?? ""}`}
      style={style} 
    >
      {prefix} {authors?.join(", ")}
    </div>
  </div>
);

export default ModalAuthors;
