import React from "react";
import { Button } from "./ui/button";
import useAuth from "../hooks/useAuth";
import { EventTracker } from "../eventTracker";

interface GoogleLoginProps {
  onClickBefore?: () => void;
  text?: string;
  className?: string;
}

export default function GoogleLogin({
  onClickBefore,
  text,
  className,
}: GoogleLoginProps) {
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <Button
      onClick={() => {
        try {
          onClickBefore?.();
        } catch (e) {}
        handleGoogleLogin();
      }}
      variant="outline"
      className={`rounded-full w-max-full h-[50px] w-[50px] cursor-pointer border-2 p-0 ${className}`}
      clickable={true}
    >
      <img
        src="/google.png"
        alt="Google Logo"
        width={24}
        height={26}
        className="flex flex-shrink-0"
      />
      {text && <div className="font-normal text-base">{text}</div>}
    </Button>
  );
}
