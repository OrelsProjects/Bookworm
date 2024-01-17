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
    Logger.info("Confirming user before get user", user?.id ?? "What??", {
      user,
    });
    if (!user) {
      throw new Error("Missing user object");
    }
    Logger.info("Confirming user after get user", user.id);
    const userDto: UserDTO = await confirmUser(user);
    Logger.info("Confirming user after confirm user", user.id);
    user = FromResponseUser(userDto, user?.token || "");
    return NextResponse.json({ result: user }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error confirming user", user?.id ?? "No user id", {
      data: {
        user,
      },
      error,
    });
    return NextResponse.json(
      { error },
      { status: error?.response?.status ?? 501 }
    );
  }
}

async function confirmUser(user: User): Promise<UserDTO> {
  Logger.info("Confirming user function called", user.id);
  if (!user) {
    throw new Error("Missing user object");
  }
  if (!user.id) {
    throw new Error("Missing user user id");
  }
  if (!user.email) {
    throw new Error("Missing user email");
  }
  Logger.info("Confirming user function after checks", user.id);

  const axios = GetAxiosInstance(user.id, user.token);
  Logger.info("Confirming user function after axios", user.id, {
    data: {
      user,
      axiosHeaders: axios.defaults.headers,
      newUserDto: new UserDTO(user),
    },
  });
  const userDto = new UserDTO(user);
  Logger.info("Confirming user function after userDto", user.id, {
    data: {
      userDto,
    },
  });
  try {
    const createUserResponse = await axios.post<UserDTO>("/user", {
      ...userDto,
    });
    return createUserResponse.data;
  } catch (error: any) {
    if (error.response.status === 409) {
      try {
        const response = await axios.get<UserDTO>("/user");
        const userDto = response.data;
        return userDto;
      } catch (error: any) {
        Logger.error("Error getting user", user.id, {
          data: {
            user,
          },
          error,
        });
        Logger.error("Error getting user", user.id, {
          data: {
            user,
          },
          error,
        });
        throw error;
      }
    } else {
      Logger.error("Error getting user", user.id, {
        data: {
          user,
        },
        error,
      });
      throw error;
    }
  }
}
