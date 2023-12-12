"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SearchBar from "@/src/components/searchBar";
import VideoBackground from "@/src/components/videoBackground";
import { signInWithRedirect, signOut } from "aws-amplify/auth";
import { Button } from "@/src/components/button";
import { selectAuth } from "@/src/lib/features/auth/authSlice";

export default function Home() {
  const { user, loading, error } = useSelector(selectAuth);

  const loginWithGoogle = async (): Promise<void> => {
    await signInWithRedirect({
      provider: "Google",
    });
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="h-screen v-screen flex flex-col justify-center items-center">
          <VideoBackground />
          <div className="w-full px-16 z-30">
            <SearchBar />
            <div>User: {`${JSON.stringify(user)}`}</div>
          </div>
        </div>
      )}
    </div>
  );
}
