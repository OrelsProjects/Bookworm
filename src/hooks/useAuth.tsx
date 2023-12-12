import { useCallback, useEffect, useState } from "react";
import awsConfig from "@/aws-exports";
import { Amplify } from "aws-amplify";
import { User } from "../types/user";
import {
  signInWithRedirect,
  fetchAuthSession,
  SignInWithRedirectInput,
  signOut as signOutAuth,
  AuthUser,
  getCurrentUser,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export interface IAuthHook {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signUpWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const useAuth = (): IAuthHook => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [customState, setCustomState] = useState<string | null>(null);

  Amplify.configure(awsConfig);

  useEffect(() => {
    debugger;
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

  const signInWithEmail = useCallback(async (): Promise<User | null> => {
    return null;
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      return null;
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    await signOutAuth();
  }, []);

  return {
    signInWithGoogle,
    signUpWithGoogle,
    signOut,
    user,
    loading,
  };
};

export default useAuth;
