import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user";

export interface Auth {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signUpWithEmail: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const useAuth = (): Auth => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    return null;
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      return null;
    },
    []
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      return null;
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {}, []);

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
