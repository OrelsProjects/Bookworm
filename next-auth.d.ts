import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface SessionUser {
    userId: string;
  }

  interface Session {
    user: SessionUser & DefaultSession["user"];
  }
}
