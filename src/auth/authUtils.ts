import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import prisma from "../app/api/_db/db";
import loggerServer from "../loggerServer";

export const getSession = async ({
  session,
  token,
  user,
}: {
  session: Session;
  token: JWT;
  user: AdapterUser;
}) => {
  let userInDB = await prisma.user.findFirst({
    where: {
      id: token.sub,
    },
  });
  if (session?.user) {
    if (session?.user.image !== userInDB?.image) {
      await prisma.user.update({
        where: {
          id: token.sub,
        },
        data: {
          image: session.user.image,
        },
      });
    }

    session.user.userId = token.sub!;
  }

  return session;
};

export const signIn = async (session: any) => {
  try {
    let additionalUserData = {};
    const 
    let userInDB = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (!userInDB) {
      const newUser = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email || "",
          image: session.user.image || "",
          name: session.user.name || "",
          updatedAt: new Date(),
        },
      });
      additionalUserData = { ...newUser };
    }

    return {
      ...session,
      ...additionalUserData,
    };
  } catch (e: any) {
    loggerServer.error("Error signing in", session.user.id, { error: e });
  }
};
