import React, { useState } from "react";
import Marquee from "react-fast-marquee";

export default function MarqueeText({
  children,
  withSpace = false,
}: {
  children: React.ReactNode;
  withSpace?: boolean;
}) {
  const [isFinished, setIsFinished] = useState(false);

  return (
    <Marquee
      autoFill
      speed={35}
      loop={1}
      pauseOnClick
      onFinish={() => setTimeout(() => setIsFinished(true), 500)}
    >
      {children}
      {isFinished && <div className="w-full invisible">{children}</div>}
      {isFinished && <div className="w-full invisible">{children}</div>}
    </Marquee>
  );
}
