"use client";

// import useAuth, { IAuthHook } from "../hooks/useAuth";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const { signUpWithGoogle, signOut, user, loading }: IAuthHook = useAuth();

//   const router = useRouter();

//   useEffect(() => {
//     const signInWithGoogle = async () =>
//     await signUpWithGoogle();

//     signInWithGoogle();
//     // if (loading) return;
//     // if (!user) {
//     //   router.push("/login");
//     // } else {
//     //   router.push("/home");
//     // }
//   }, [loading, user]);

//   return <div>{loading && <div>Loading... Home page</div>}</div>;
// }

import React, { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import {
  signInWithRedirect,
  signOut,
  getCurrentUser,
  AuthUser,
} from "aws-amplify/auth";
import { Button } from "../components/Button";
import { Amplify } from "@aws-amplify/core";
import config from "../amplifyconfiguration.json";
Amplify.configure(config);

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [customState, setCustomState] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  // Get code from url:
  // http://localhost:3001/?code=593f4c75-741d-4bf5-a19b-41a609633cf6&state=aKh7oMdWj9IV5awnuIVFmEm9o3bI00n3-73686f7070696e672d63617274
  useEffect(() => {
    const url = window.location.href;
    let code = url.split("?code=")[1];
    if (code) {
      code = code.split("&state=")[0];
      console.log(code);
      setCode(code);
    }
  }, []);

  useEffect(() => {
    Hub.listen("auth", ({ payload }) => {
      debugger;
      console.log("Payload: ", payload);
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

    // return unsubscribe;
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

  async function exchangeCodeForToken() {
    const clientId =
      "625992521408-vipekmqg8olo93o5a2p2aof1mvr0isj7.apps.googleusercontent.com"; // Replace with your Google client ID
    const clientSecret = "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"; // Replace with your Google client secret
    const redirectUri =
      "https://bookwormapp7ee6ffe0-7ee6ffe0-dev.auth.us-east-1.amazoncognito.com/oauth2/idpresponse"; // Replace with the redirect URI registered in Google

    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    const params = new URLSearchParams();

    params.append("code", code ?? "");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("redirect_uri", redirectUri);
    params.append("grant_type", "authorization_code");
    try {
      debugger;
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });
      debugger;
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
    } catch (error) {
      debugger;
      console.error("Error during token exchange:", error);
    }
    // debugger;
    // fetch(tokenEndpoint, {
    //   method: "POST",
    //   body: params,
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    // })
    //   .then((response) => {
    //     debugger;
    //     response
    //       .json()
    //       .then((data) => {
    //         if (data.access_token) {
    //           console.log("Access Token:", data.access_token);
    //           // You can now use the access token to make API requests
    //         } else {
    //           console.error("Error obtaining access token:", data);
    //         }
    //       })
    //       .catch((error) => {
    //         debugger;
    //         console.error("Error obtaining access token:", error);
    //       });
    //   })
    //   .catch((error) => {
    //     debugger;
    //     console.error("Error during token exchange:", error);
    //   });
  }

  return (
    <div className="flex flex-col">
      <Button
        onClick={() =>
          signInWithRedirect({
            provider: "Google",
            customState: "shopping-cart",
          })
        }
      >
        Open Google
      </Button>
      <Button onClick={() => exchangeCodeForToken()}>Exchange Code</Button>
      <Button onClick={() => signOut()}>Sign Out</Button>
      <div>{user?.username}</div>
      <div>{customState}</div>
    </div>
  );
}

export default App;
