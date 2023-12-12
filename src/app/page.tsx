"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import awsConfig from "../amplifyconfiguration.json";
import useAuth from "../hooks/useAuth";

Amplify.configure(awsConfig);

function App() {
  const { user, loading, customState, error, signInWithGoogle, signOut } =
    useAuth();

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
