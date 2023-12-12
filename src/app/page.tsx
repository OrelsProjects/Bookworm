"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectAuth } from "../lib/features/auth/authSlice";

function App() {
  const router = useRouter();

  const { user, loading, error } = useSelector(selectAuth);

  useEffect(() => {
    if (!loading && user) {
      router.push("/home");
    }
  }, [loading, user]);

  return (
    <div className="flex flex-col justify-center items-center">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* <button onClick={() => signInWithGoogle()}>Open Google</button>
          <button onClick={() => signOut()}>Sign Out</button> */}
          <div>{user?.id}</div>
          <div>{user?.email}</div>
          <div>{user?.token}</div>
          {/* <div>{customState}</div> */}
        </>
      )}
    </div>
  );
}

export default App;
