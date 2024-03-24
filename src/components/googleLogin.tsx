import React from "react";
import { Button } from "./ui/button";
import useAuth from "../hooks/useAuth";

interface GoogleLoginProps {
  onClickBefore?: () => void;
}

export default function GoogleLogin({ onClickBefore }: GoogleLoginProps) {
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => await signInWithGoogle();

  return (
    <Button
      onClick={() => {
        onClickBefore?.();
        handleGoogleLogin();
      }}
      variant="outline"
      className="rounded-full w-full"
    >
      <div className="h-full w-full flex flex-row gap-2">
        <img src="/google.png" alt="Google Logo" width={22} height={24} />
        <div className="font-normal text-base">Continue with Google</div>
      </div>
    </Button>
  );
}
