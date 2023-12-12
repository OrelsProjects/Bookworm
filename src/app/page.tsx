"use client";

import React, { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import {
  signInWithRedirect,
  signOut,
  getCurrentUser,
  AuthUser,
} from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import awsConfig from "../amplifyconfiguration.json";

Amplify.configure(awsConfig);

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [customState, setCustomState] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          setError("An error has ocurred during the OAuth flow.");
          break;
        case "customOAuthState":
          setCustomState(payload.data);
          break;
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  const getUser = async (): Promise<void> => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error(error);
      console.log("Not signed in");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <button
        onClick={() =>
          signInWithRedirect({
            provider: "Google",
            customState: "shopping-cart",
          })
        }
      >
        Open Google
      </button>

      <button onClick={() => signOut()}>Sign Out</button>
      <div>{user?.username}</div>
      <div>{customState}</div>
    </div>
  );
}

export default App;
