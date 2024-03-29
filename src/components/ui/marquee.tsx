import React, { useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import useIsOverflow from "../../hooks/useIsOverflow";

export default function MarqueeText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const isOverflow = useIsOverflow({
    ref: divRef,
    isVerticalOverflow: false,
    delay: 100,
  });
  const [key, setKey] = useState(0); // Add a key state to force re-render


  const TextDiv = ({ marquee }: { marquee?: boolean }) => (
    <p ref={divRef} className={className}>
      {marquee ? text + " • " : `${text}`}
    </p>
  );

  return isOverflow ? (
    <Marquee autoFill speed={35} loop={3} pauseOnClick>
      <TextDiv marquee />
    </Marquee>
  ) : (
    <TextDiv />
  );
}
