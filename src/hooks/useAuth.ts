import { useCallback } from "react";
import {
  signInWithRedirect,
  SignInWithRedirectInput,
  signOut as signOutAuth,
} from "aws-amplify/auth";

import { useDispatch } from "react-redux";
import { clearUser, setError } from "../lib/features/auth/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();

  const signUpWithGoogle = useCallback(async () => {
    const signInWithRedirectInput: SignInWithRedirectInput = {
      provider: "Google",
    };
    try {
      await signInWithRedirect(signInWithRedirectInput);
    } catch (error) {
      dispatch(setError("Failed to sign up"));
      console.error(error);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const signInWithRedirectInput: SignInWithRedirectInput = {
      provider: "Google",
    };
    try {
      await signInWithRedirect(signInWithRedirectInput);
    } catch (error) {
      dispatch(setError("Failed to sign in"));
      console.error(error);
    }
    return null;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await signOutAuth();
      dispatch(clearUser());
    } catch (error) {
      dispatch(setError("Failed to sign out"));
      console.error(error);
    }
  }, []);

  return {
    signInWithGoogle,
    signUpWithGoogle,
    signOut,
  };
};

export default useAuth;
