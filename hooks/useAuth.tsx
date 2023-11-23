import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase.config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { User } from "../types/user";
import { firebaseUserToUser } from "../converters/firebase";

export interface Auth {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signUpWithEmail: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const useAuth = (): Auth => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser: FirebaseUser | null) => {
        setUser(firebaseUserToUser(currentUser));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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

  const signUpWithEmail = useCallback(
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

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  return {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    user,
    loading,
  };
};

export default useAuth;
