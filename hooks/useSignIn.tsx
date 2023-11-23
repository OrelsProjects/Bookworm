import { useCallback } from "react";
import { auth } from "../firebase.config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import useAuthStatus, { AuthStatus } from "./useAuthStatus";
import { User } from "../types/user";
import { firebaseUserToUser } from "../converters/firebase";

export interface SignInFunctions {
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
}

const useSignIn = (): SignInFunctions => {
  const { user, loading }: AuthStatus = useAuthStatus();

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    const provider = new GoogleAuthProvider();
    try {
      if (user) return user;
      const result = await signInWithPopup(auth, provider); // TODO: Handle auth/cancelled-popup-request error
      return firebaseUserToUser(result.user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return firebaseUserToUser(result.user);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    []
  );

  return { signInWithGoogle, signInWithEmail };
};

export default useSignIn;
