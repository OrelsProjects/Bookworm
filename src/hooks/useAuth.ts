import { useCallback } from "react";
import {
  signInWithRedirect,
  SignInWithRedirectInput,
  signOut as signOutAuth,
} from "aws-amplify/auth";

import { Amplify } from "aws-amplify";
import awsConfig from "../amplifyconfiguration.json";
Amplify.configure(awsConfig);

const useAuth = () => {
  const signUpWithGoogle = useCallback(async () => {
    const signInWithRedirectInput: SignInWithRedirectInput = {
      provider: "Google",
    };
    await signInWithRedirect(signInWithRedirectInput);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const signInWithRedirectInput: SignInWithRedirectInput = {
      provider: "Google",
    };
    await signInWithRedirect(signInWithRedirectInput);
    return null;
  }, []);

  const signOut = useCallback(async () => {
    await signOutAuth();
  }, []);

  return {
    signInWithGoogle,
    signUpWithGoogle,
    signOut,
  };
};

export default useAuth;
