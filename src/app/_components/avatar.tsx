"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/src/components/dropdown";
import useAuth from "@/src/hooks/useAuth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectUserBooks } from "@/src/lib/features/userBooks/userBooksSlice";
import Papa from "papaparse";
import { EventTracker } from "@/src/eventTracker";
import { Feedback, Privacy, SignOut } from "../../components/icons";

const FEEDBACK_GIVEN = "feedback_given";

type AvatarProps = {
  avatarUrl?: string;
  defaultText?: string;
};

const Avatar: React.FC<AvatarProps> = ({ avatarUrl, defaultText }) => {
  const router = useRouter();
  const { userBooksData } = useSelector(selectUserBooks);
  const [showDropdown, setShowDropdown] = React.useState<boolean>(false);
  const [isClosing, setIsClosing] = React.useState<boolean>(false);
  const [avatarImageLoaded, setAvatarImageLoaded] =
    React.useState<boolean>(false);
  const { signOut } = useAuth();
  let closingTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (!avatarUrl) return;

    const img = new Image();
    img.src = avatarUrl;
    img.onload = () => {
      setAvatarImageLoaded(true);
    };
    img.onerror = () => {
      setAvatarImageLoaded(false);
    };
  }, [avatarUrl]);

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
    <div className="relative rounded-full h-9 w-9" onClick={toggleDropdown}>
      {!avatarImageLoaded ? (
        <img
          src={avatarUrl}
          height={36}
          width={36}
          alt={"avatar"}
          className="cursor-pointer rounded-full"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-background border-1 border-foreground flex justify-center items-center">
          {defaultText && (defaultText.substring(0, 2) || "").toUpperCase()}
        </div>
      )}
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
                  <Feedback.Fill iconSize="sm" className="!text-background" />
                ),
                position: 1,
                onClick: () => {
                  handleFeedbackClick();
                },
              },
              {
                label: "Privacy",
                leftIcon: (
                  <Privacy.Fill iconSize="sm" className="!text-background" />
                ),
                position: 2,
                onClick: () => handleNavigateToPolicy(),
              },
              {
                label: "Sign Out",
                leftIcon: (
                  <SignOut.Fill iconSize="sm" className="!text-background" />
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
