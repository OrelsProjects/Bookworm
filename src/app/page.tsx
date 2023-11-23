"use client";

import useAuth, { Auth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { signInWithGoogle, signInWithEmail, signOut, user, loading }: Auth =
    useAuth();

  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    } else {
      router.push("/home");
    }
  }, [loading, user]);

  return <div>{loading && <div>Loading...</div>}</div>;
}
