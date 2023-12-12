"use client";

import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";
import awsConfig from "../amplifyconfiguration.json";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";

Amplify.configure(awsConfig);

function App() {
  const router = useRouter();

  const { user, loading, customState, error, signInWithGoogle, signOut } =
    useAuth();

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
          <button onClick={() => signInWithGoogle()}>Open Google</button>
          <button onClick={() => signOut()}>Sign Out</button>
          <div>{user?.id}</div>
          <div>{user?.email}</div>
          <div>{user?.token}</div>
          <div>{customState}</div>
        </>
      )}
    </div>
  );
}

export default App;
