"use client";

import useAuth, { IAuthHook } from "@/src/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/src/components/searchBar";
import VideoBackground from "@/src/components/videoBackground";

export default function Home() {
  const { signOut, user, loading }: IAuthHook = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="h-screen v-screen flex flex-col justify-center items-center">
          <VideoBackground />
          <div className="w-full px-16">
            <SearchBar />
          </div>
        </div>
      )}
    </div>
  );
}
