import { useCallback } from "react";
import {
  signInWithRedirect,
  SignInWithRedirectInput,
  signOut as signOutAuth,
} from "aws-amplify/auth";

import { useDispatch } from "react-redux";

const useAuth = () => {
  const dispatch = useDispatch();

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
    dispatch(clearUser());
  }, []);

  return {
    signInWithGoogle,
    signUpWithGoogle,
    signOut,
  };
};

export default useAuth;
function clearUser(): any {
  throw new Error("Function not implemented.");
}
