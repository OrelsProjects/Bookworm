import Logger from "@/src/utils/loggerServer";
import { User } from "@/src/models";
import { IResponse } from "@/src/models/dto/response";
import { UserDTO } from "@/src/models/dto/userDTO";
import { FromResponseUser } from "@/src/models/user";
import { GetAxiosInstance } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<User>>> {
  let user: User | undefined = undefined;
  try {
    const body = await req.json();
    user = body.data;
    if (!user) {
      throw new Error("Missing user object");
    }
    const userDto: UserDTO = await confirmUser(user);
    user = FromResponseUser(userDto, user?.token || "");
    return NextResponse.json({ result: user }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error confirming user", user?.userId ?? "No user id", {
      data: {
        user,
      },
      error,
    });
    return NextResponse.json(
      { error },
      { status: error?.response?.status ?? 500 }
    );
  }
}

const createUser = async (user: User): Promise<User> => {
  try {
    if (!user) {
      throw new Error("Missing user object");
    }
    if (!user.userId) {
      throw new Error("Missing user user id");
    }
    if (!user.email) {
      throw new Error("Missing user email");
    }

    const axios = GetAxiosInstance(user.userId, user.token);
    const createUserResponse = await axios.post<User>("/user", {
      ...user,
    });
    return createUserResponse.data;
  } catch (error: any) {
    Logger.error("Error creating user", user.userId, {
      data: {
        user,
      },
      error,
    });
    throw error;
  }
};

async function confirmUser(user: User): Promise<User> {
  const axios = GetAxiosInstance(user.userId, user.token);
  const { token, ...userDto } = user;
  try {
    const response = await axios.get<User>("/user");
    let userResponse = response.data;
    if (!userResponse) {
      userResponse = await createUser(user);
    }

    return userResponse;
  } catch (error: any) {
    Logger.error("Error getting user", user.userId, {
      data: {
        user,
      },
      error,
    });
    Logger.error("Error getting user", user.userId, {
      data: {
        user,
      },
      error,
    });
    throw error;
  }
}
