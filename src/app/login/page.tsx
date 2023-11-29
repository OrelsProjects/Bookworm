"use client";

import useAuth, { Auth } from "../../../hooks/useAuth";
import { Button } from "../../../components/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { signInWithGoogle, signInWithEmail, signOut, user, loading }: Auth =
    useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/home");
    }
  }, [loading, user]);

  const testAPIAuth = async () => {
    console.log("testing");
    const res = await fetch("/api/test");
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-3xl mb-3">Bookworm</h1>
            <Button variant="outline" onClick={() => signInWithGoogle()}>
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                console.log("clicked");
                testAPIAuth()
                  .then(() => console.log("done"))
                  .catch(() => console.log("error"));
              }}
            >
              Test API
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
