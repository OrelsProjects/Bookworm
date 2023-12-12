"use client";
import React, { useEffect, useState } from "react";
import { Hub } from "@aws-amplify/core";
import {
  signInWithRedirect,
  signOut,
  getCurrentUser,
  AuthUser,
  deleteUser,
} from "aws-amplify/auth";
import awsConfig from "../amplifyconfiguration.json";
import { Amplify } from "@aws-amplify/core";
Amplify.configure(awsConfig);

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [customState, setCustomState] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      debugger;
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          setError("An error has ocurred during the OAuth flow.");
          break;
        case "customOAuthState":
          setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
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
        onClick={() => signInWithRedirect({ customState: "shopping-cart" })}
      >
        Open Hosted UI
      </button>
      <button
        onClick={() =>
          signInWithRedirect({
            provider: "Facebook",
            customState: "shopping-cart",
          })
        }
      >
        Open Facebook
      </button>
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
      <button
        onClick={() =>
          signInWithRedirect({
            provider: "Amazon",
            customState: "shopping-cart",
          })
        }
      >
        Open Amazon
      </button>
      <button
        onClick={() =>
          signInWithRedirect({
            provider: "Apple",
            customState: "shopping-cart",
          })
        }
      >
        Open Apple
      </button>
      <button onClick={() => signOut()}>Sign Out</button>
      <button onClick={() => deleteUser()}>Delete User</button>
      <div>{user?.username}</div>
      <div>{customState}</div>
    </div>
  );
}

export default App;
