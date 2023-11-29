"use client";

import useAuth, { Auth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { signInWithGoogle, signInWithEmail, signOut, user, loading }: Auth =
    useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user) {
      router.push("/home");
    }
  }, [loading, user]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>{user && <div> Logged in as {user.name} </div>}</div>
      )}
    </div>
  );
}
