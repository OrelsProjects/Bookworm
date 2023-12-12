import { useCallback, useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { User } from "../types/user";
import {
  signInWithRedirect,
  SignInWithRedirectInput,
  signOut as signOutAuth,
  fetchAuthSession,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import awsConfig from "../amplifyconfiguration.json";
import { AuthSession as AWSAuthSession } from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { convert as convertUser } from "../types/user_converter";

export interface IAuthHook {
  user: User | null;
  loading: boolean;
  error: unknown;
  customState: string | null;
  signInWithGoogle: () => Promise<User | null>;
  signUpWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const useAuth = (): IAuthHook => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [customState, setCustomState] = useState<string | null>(null);

  Amplify.configure(awsConfig);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          setError("An error has ocurred during the OAuth flow.");
          setLoading(false);
          break;
        case "customOAuthState":
          setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
          setLoading(false);
          break;
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  const getUser = async (): Promise<void> => {
    try {
      const authSession: AWSAuthSession = await fetchAuthSession();
      setUser(convertUser(authSession));
    } catch (error) {
      console.error(error);
      console.log("Not signed in");
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = useCallback(async (): Promise<User | null> => {
    const signInWithRedirectInput: SignInWithRedirectInput = {
      provider: "Google",
    };
    await signInWithRedirect(signInWithRedirectInput);
    return null;
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    const signInWithRedirectInput: SignInWithRedirectInput = {
      provider: "Google",
    };
    await signInWithRedirect(signInWithRedirectInput);
    return null;
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await signOutAuth();
  }, []);

  return {
    signInWithGoogle,
    signUpWithGoogle,
    signOut,
    user,
    customState,
    loading,
    error,
  };
};

export default useAuth;
