import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import { getFirestore } from "firebase/firestore";

import "firebase/firestore";
import "../../../../../firebase.config"; // For app initialization

const firestore = getFirestore();

const getConfig = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret)
    throw new Error("Missing Google Client ID or Client Secret");

  return {
    clientId,
    clientSecret,
  };
};

export const authOptions = {
  providers: [GoogleProvider(getConfig())],
  adapter: FirebaseAdapter(firestore),
  callbacks: {
    async session({ session }: { session: any }) {
      return session;
    },
    async signIn(user: any) {
      try {
        console.log("signIn", user);
        let additionalUserData = {};
        return {
          ...user,
          ...additionalUserData,
        };
      } catch (e) {
        console.log("sign in error");
        console.log(e);
      }
    },
    
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
