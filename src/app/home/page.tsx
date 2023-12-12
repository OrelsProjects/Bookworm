"use client";

import useAuth, { IAuthHook } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/button";

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
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-3xl mb-3">Bookworm</h1>
          {user && <div>Logged in as {user.name}</div>}
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      )}
    </div>
  );
}
