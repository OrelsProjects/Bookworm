import { useState, useEffect } from "react";
import { auth } from "../firebase.config";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { User } from "../types/user";
import { firebaseUserToUser } from "../converters/firebase";

export interface AuthStatus {
  user: User | null;
  loading: boolean;
}

const useAuthStatus = (): AuthStatus => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser: FirebaseUser | null) => {
        const user = firebaseUserToUser(currentUser);
        setUser(user);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useAuthStatus;
