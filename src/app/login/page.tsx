"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuth } from "../../lib/features/auth/authSlice";
import GoogleLogin from "../../components/googleLogin";

const Login: React.FC = () => {
  const router = useRouter();

  const { user, loadingState } = useSelector(selectAuth);

  useEffect(() => {
    if (!loadingState.loading && user) {
      router.push("/explore");
    }
  }, [loadingState, user]);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center px-4 gap-12 overflow-auto">
      <div className="w-fit h-fit flex flex-row justify-center items-center gap-1 hover:!text-muted">
        <Image
          src="/favicon.png"
          alt="logo"
          width={60}
          height={60}
          className="hover:cursor-pointer"
        />
        <div className="flex justify-start items-start">
          <span className="text-6xl font-thin hover:cursor-pointer pt-2">
            BookWiz
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-base overflow-auto">
        <div className="font-bold text-xl">Welcome to BookWiz!</div>
        <div className="text-lg">
          BookWiz is a platform for getting personalized lists recommendations,
          creating and sharing books list with your friends.
        </div>
      </div>
      <GoogleLogin text="Join BookWiz" />
    </div>
  );
};

export default Login;
