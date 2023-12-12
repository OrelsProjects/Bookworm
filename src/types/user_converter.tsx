import { AuthSession as AWSAuthSession } from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { User } from "./user";

export const convert = (session: AWSAuthSession) =>
  new User(
    session.userSub ?? "",
    "",
    session?.tokens?.accessToken?.payload?.email?.toString() ??
      session?.tokens?.idToken?.payload?.email?.toString() ??
      "",
    session.credentials?.sessionToken ?? ""
  );
