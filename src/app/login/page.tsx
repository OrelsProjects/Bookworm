"use client";

import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Button } from "../../components";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuth } from "../../lib/features/auth/authSlice";

const Login: React.FC = () => {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const { user, loadingState } = useSelector(selectAuth);

  useEffect(() => {
    if (!loadingState.loading && user) {
      router.push("/home");
    }
  }, [loadingState, user]);

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center px-8 gap-12">
      <img
        src="/logo.png"
        alt="Bookshelf Logo"
        className="!relative !w-96 !h-72"
      />
      <div className="flex flex-col gap-2 text-base">
        <div className="font-bold">Welcome to Hogwarts!</div>
        <div>Hogwarts is a platform for sharing book lists between friends</div>
      </div>
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="rounded-full w-full"
      >
        <div className="h-full w-full flex flex-row gap-2">
          <img src="/google.png" alt="Google Logo" width={24} height={24} />
          <div className="font-normal text-base">Continue with Google</div>
        </div>
      </Button>
    </div>
  );
};

export default Login;
