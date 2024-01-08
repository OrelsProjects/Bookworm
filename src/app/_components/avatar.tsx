"use client";

import React from "react";
import Image from "next/image";
import Dropdown from "@/src/components/dropdown";
import useAuth from "@/src/hooks/useAuth";

const Avatar: React.FC = () => {
  const [showDropdown, setShowDropdown] = React.useState<boolean>(false);
  const [isClosing, setIsClosing] = React.useState<boolean>(false);
  const { signOut } = useAuth();
  let closingTimeout: NodeJS.Timeout | null = null;

  // 50 ms timeout to allow the dropdown to close before setting the state
  const toggleIsClosing = () => {
    setIsClosing(true);
    if (closingTimeout) {
      clearTimeout(closingTimeout);
    }
    closingTimeout = setTimeout(() => {
      setIsClosing(false);
    }, 100);
  };

  const toggleDropdown = () => {
    if (!isClosing) {
      setShowDropdown(!showDropdown);
    }
    setIsClosing(false); // Reset the closing state
  };

  return (
    <div className="relative">
      <Image
        src="/avatar.png"
        height={48}
        width={48}
        alt={"avatar"}
        className="cursor-pointer"
        onClick={toggleDropdown}
      />
      {showDropdown && (
        <div className="absolute top-full right-0 w-36 mt-2">
          <Dropdown
            items={[
              {
                label: "Sign Out",
                leftIcon: (
                  <Image
                    src="/signOut.svg"
                    height={24}
                    width={24}
                    alt="sign out"
                  />
                ),
                onClick: () => signOut(),
              },
            ]}
            onClose={() => {
              setShowDropdown(false);
              toggleIsClosing();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Avatar;
