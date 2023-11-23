import { User as FirebaseUser } from "firebase/auth";
import { User } from "../types/user";

export const convertFirebaseUserToUser = (
  firebaseUser: FirebaseUser | null
): User | null => {
  if (!firebaseUser) return null;

  return firebaseUserToUser(firebaseUser);
};

export const firebaseUserToUser = (
  firebaseUser: FirebaseUser | null
): User | null => {
  if (!firebaseUser) return null;
  return new User(
    firebaseUser.uid,
    firebaseUser.displayName || "",
    firebaseUser.email || "",
    firebaseUser.refreshToken
  );
};
