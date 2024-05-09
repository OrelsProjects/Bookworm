import React from "react";

type AuthorsProps = {
  authors?: string[];
  prefix?: string;
  className?: string;
  style?: React.CSSProperties;
};

const GenericAuthors: React.FC<AuthorsProps> = ({
  authors,
  prefix,
  className,
  style,
}) => (
  <div className="flex flex-grow">
    <div
      className={`text-primary text-sm font-normal flex-1 line-clamp-1 ${className ?? ""}`}
      style={style}
    >
      {prefix} {authors?.join(", ")}
    </div>
  </div>
);

export default GenericAuthors;
