"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/src/components/dropdown";
import useAuth from "@/src/hooks/useAuth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectUserBooks } from "@/src/lib/features/userBooks/userBooksSlice";
import Papa from "papaparse";
import { EventTracker } from "@/src/eventTracker";

const FEEDBACK_GIVEN = "feedback_given";

type AvatarProps = {
  avatarUrl?: string;
};

const Avatar: React.FC<AvatarProps> = ({ avatarUrl }) => {
  const router = useRouter();
  const dispatch = useDispatch();
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

  const handleFeedbackClick = () => {
    localStorage.setItem(FEEDBACK_GIVEN, "true");
    EventTracker.track("User clicked on feedback button");
    // open url: "https://forms.gle/q3XqsasS6pwC5Ezb6"
    window.open("https://forms.gle/q3XqsasS6pwC5Ezb6", "_blank");
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

  const handleNavigateToPolicy = () => {
    router.push("/privacy-policy");
    toggleDropdown();
  };

  return (
    <div className="relative rounded-full">
      <img
        src="/avatar.png"
        height={36}
        width={36}
        alt={"avatar"}
        className="cursor-pointer rounded-full"
        onClick={toggleDropdown}
      />
      {showDropdown && (
        <div className="absolute top-full right-0 w-36 mt-2">
          <Dropdown
            items={[
              // {
              //   label: "Import Books",
              //   leftIcon: (
              //     <img
              //       src="/import.svg"
              //       alt="import"
              //       fill
              //       className="!relative !w-8 !h-7"
              //     />
              //   ),
              //   position: 0,
              //   onClick: () => {
              //     dispatch(showModal({ type: BottomSheetTypes.IMPORT_BOOKS }));
              //   },
              // },
              {
                label: "Feedback",
                leftIcon: (
                  <img
                    src="/feedbackIcon.png"
                    alt="feedback"
                    className="!relative !w-8 !h-7"
                  />
                ),
                position: 1,
                onClick: () => {
                  handleFeedbackClick();
                },
              },
              {
                label: "Privacy",
                leftIcon: (
                  <img
                    src="/privacy.png"
                    height={24}
                    width={24}
                    alt="privacy"
                  />
                ),
                position: 2,
                onClick: () => handleNavigateToPolicy(),
              },
              {
                label: "Sign Out",
                leftIcon: (
                  <img
                    src="/signOut.svg"
                    height={24}
                    width={24}
                    alt="sign out"
                  />
                ),
                position: 3,
                onClick: () => handleSignOut(),
              },
              // {
              //   label: "Export Data",
              //   leftIcon: (
              //     <img
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
