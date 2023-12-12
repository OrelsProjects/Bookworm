import Image from "next/image";
import React from "react";

const VideoBackground = () => {
  return (
    <div className="absolute w-full h-full z-0 overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          className="absolute left-0 right-0 -top-36 w-full h-full z-20"
          src="/background_shadow.png"
          height={424}
          width={720}
          alt="background shadow spot"
        />
        {/* Video */}
        <video
          autoPlay
          loop
          muted
          className="object-cover w-full h-full absolute z-0"
        >
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-background opacity-80 z-10" />
        {/* Content can go here, and will be stacked above the overlay */}
      </div>
    </div>
  );
};

export default VideoBackground;
