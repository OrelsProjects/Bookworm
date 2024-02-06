"use client";

import React from "react";
import Image from "next/image";
import Dropdown from "@/src/components/dropdown";
import useAuth from "@/src/hooks/useAuth";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUserBooks } from "@/src/lib/features/userBooks/userBooksSlice";
import Papa from "papaparse";

const Avatar: React.FC = () => {
  const { userBooksData } = useSelector(selectUserBooks);
  const [showDropdown, setShowDropdown] = React.useState<boolean>(false);
  const [isClosing, setIsClosing] = React.useState<boolean>(false);
  const { signOut } = useAuth();
  let closingTimeout: NodeJS.Timeout | null = null;

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

  const handleSignOut = async () => {
    toast.promise(signOut(), {
      loading: "Signing out...",
      success: "Signed out",
      error: "Error signing out",
    });
  };

  const handleExportData = async () => {
    
    const csv = Papa.unparse(userBooksData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-books.csv";
    a.click();
    toggleDropdown();
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
                onClick: () => handleSignOut(),
              },
              // {
              //   label: "Export Data",
              //   leftIcon: (
              //     <Image
              //       src="/export.svg"
              //       height={24}
              //       width={24}
              //       alt="export"
              //     />
              //   ),
              //   onClick: () => {
              //     handleExportData();
              //   },
              // },
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
