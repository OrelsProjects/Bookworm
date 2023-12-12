"use client";

import useAuth, { Auth } from "../../hooks/useAuth";
import { Button } from "../../components/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/src/components/search-bar";

export default function Home() {
  const { signInWithGoogle, signInWithEmail, signOut, user, loading }: Auth =
    useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/home");
    }
  }, [loading, user]);

  return (
    <div>
      {!loading ? (
        <div className="">Loading...</div>
      ) : (
        <div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-3xl mb-3">Bookworm</h1>
            <Button onClick={() => signInWithGoogle()}>
              Sign in with Google
            </Button>
            <SearchBar />
          </div>
        </div>
      )}
    </div>
  );
}
