"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/src/components/ui/dropdown";
import useAuth from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectUserBooks } from "@/src/lib/features/userBooks/userBooksSlice";
import Papa from "papaparse";
import { EventTracker } from "@/src/eventTracker";
import { Feedback } from "../../components/icons/feedback";
import { Privacy } from "../../components/icons/privacy";
import { SignOut } from "../../components/icons/signOut";
import CustomImage from "../../components/image";
import { cn } from "../../../lib/utils";
import { ThemeToggle } from "../../components/ui/themeToggle";

const FEEDBACK_GIVEN = "feedback_given";

type AvatarProps = {
  avatarUrl?: string;
  defaultText?: string;
  imageClassName?: string;
};

const Avatar: React.FC<AvatarProps> = ({
  avatarUrl,
  defaultText,
  imageClassName,
}) => {
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
      pending: "Signing out...",
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

  const DefaultAvatar = () => (
    <div className="w-full h-full text-sm rounded-full bg-background border-2 border-foreground flex justify-center items-center cursor-pointer">
      {defaultText && (defaultText.substring(0, 2) || "").toUpperCase()}
    </div>
  );

  return (
    <div
      className="h-[70px] w-[70px] relative rounded-full z-50 p-[5px] md:hover:bg-slate-400/40 cursor-pointer transition-all"
      onClick={toggleDropdown}
    >
      {
        <CustomImage
          src={avatarUrl}
          placeholder={<DefaultAvatar />}
          defaultImage={<DefaultAvatar />}
          height={42}
          width={42}
          alt={"avatar"}
          className={cn(
            "cursor-pointer rounded-full mb-1 flex-shrink-0",
            imageClassName
          )}
          thumbnailSize={"sm"}
        />
      }
      {showDropdown && (
        <div className="absolute top-full right-0 md:left-0 w-36 mt-2 z-50">
          <Dropdown
            items={[
              {
                label: "Feedback",
                leftIcon: (
                  <Feedback.Fill iconSize="sm" className="!text-background" />
                ),
                position: 1,
                onClick: () => {
                  handleFeedbackClick();
                },
                closeOnClick: true,
              },
              {
                label: "Privacy",
                leftIcon: (
                  <Privacy.Fill iconSize="sm" className="!text-background" />
                ),
                position: 2,
                onClick: () => handleNavigateToPolicy(),
                closeOnClick: true,
              },
              {
                label: "Theme",
                leftIcon: <ThemeToggle />,
                position: 3,
                onClick: () => {},
                closeOnClick: false,
              },
              {
                label: "Sign Out",
                leftIcon: (
                  <SignOut.Fill iconSize="sm" className="!text-background" />
                ),
                position: 4,
                onClick: () => handleSignOut(),
                closeOnClick: true,
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
