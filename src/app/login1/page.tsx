"use client";

import useAuth, { IAuthHook } from "../../hooks/useAuth";
import { Button } from "../../components/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { signInWithGoogle, signOut, user, loading }: IAuthHook = useAuth();

  const router = useRouter();

  useEffect(() => {
    // if (!loading && user) {
    //   router.push("/home");
    // }
  }, [loading, user]);// Make sure Cognito Hosted UI has been configured correctly


async function exchangeCodeForToken(code) {
  const clientId = 'YOUR_CLIENT_ID'; // Replace with your Google client ID
  const clientSecret = 'YOUR_CLIENT_SECRET'; // Replace with your Google client secret
  const redirectUri = 'YOUR_REDIRECT_URI'; // Replace with the redirect URI registered in Google

  const tokenEndpoint = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams();

  params.append('code', code);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);
  params.append('grant_type', 'authorization_code');

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

    const data = await response.json();

    if (data.access_token) {
      console.log('Access Token:', data.access_token);
      // You can now use the access token to make API requests
    } else {
      console.error('Error obtaining access token:', data);
    }
  } catch (error) {
    console.error('Error during token exchange:', error);
  }
}

// Use this function with the code you received
exchangeCodeForToken('61768356-6d14-4ebc-8df1-97274f6ae6b8');

  return (
    <div>
      {!loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          LOGIN1
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-3xl mb-3">Bookworm</h1>
            <Button onClick={() => signInWithGoogle()}>
              Sign in with Google
            </Button>
            <Button variant="outline" onClick={() => signOut()}>
              sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
