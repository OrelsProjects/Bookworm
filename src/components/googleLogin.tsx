import React from "react";
import { Button } from "./ui/button";
import useAuth from "../hooks/useAuth";

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

  const handleGoogleLogin = async () => await signInWithGoogle();

  return (
    <Button
      onClick={() => {
        onClickBefore?.();
        handleGoogleLogin();
      }}
      variant="outline"
      className={`rounded-full w-full ${className}`}
    >
      <div className="h-full w-full flex flex-row gap-2">
        <img src="/google.png" alt="Google Logo" width={22} height={24} />
        <div className="font-normal text-base">
          {text || "Continue with Google"}
        </div>
      </div>
    </Button>
  );
}
