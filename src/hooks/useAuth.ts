import { useCallback } from "react";
import {
  signInWithRedirect,
  SignInWithRedirectInput,
  signOut as signOutAuth,
} from "aws-amplify/auth";

import { useDispatch } from "react-redux";
import { clearUser, setError } from "../lib/features/auth/authSlice";
import { setUserBooks } from "../lib/features/userBooks/userBooksSlice";

const useAuth = () => {
  const dispatch = useDispatch();

  const signUpWithGoogle = useCallback(async () => {
    const signInWithRedirectInput: SignInWithRedirectInput = {
      provider: "Google",
      options: {
        /**
         * On iOS devices, setting this to true requests that the browser not share cookies or other browsing data between
         * the authentication session and the user’s normal browser session. This will bypass the permissions dialog that
         * is displayed your user during sign-in and sign-out but also prevents reuse of existing sessions from the user's
         * browser, requiring them to re-enter their credentials even if they are already externally logged in on their
         * browser.
         *
         * On all other platforms, this flag is ignored.
         */
        preferPrivateSession: true,
      },
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
      localStorage.clear();
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
