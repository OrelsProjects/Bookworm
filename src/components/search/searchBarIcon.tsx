import React, { useState } from "react";
import { Search } from "../icons/search";
import { IconSize } from "../../consts/icon";

export default function SearchBarIcon({
  children,
  iconSize = "md",
}: {
  children?: React.ReactNode;
  iconSize?: IconSize;
}): React.ReactElement {
  // const [showSearch, setShowSearch] = useState<boolean>(false);

  return (
    <div className="w-full">
      {/* {!showSearch ? (
        <Search.Fill
          onClick={() => setShowSearch((prev) => !prev)}
          className="!text-foreground"
          iconSize={iconSize}
        />
      ) : ( */}
      {children}
      {/* )} */}
    </div>
  );
}
