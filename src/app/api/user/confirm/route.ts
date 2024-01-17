import Logger from "@/src/utils/loggerServer";
import { User } from "@/src/models";
import { IResponse } from "@/src/models/dto/response";
import { UserDTO } from "@/src/models/dto/userDTO";
import { FromResponseUser } from "@/src/models/user";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<User>>> {
  let user: User | undefined = undefined;
  try {
    Logger.info("Confirming user before get user", getUserIdFromRequest(req));
    const body = await req.json();
    user = body.data;
    if (!user) {
      throw new Error("Missing user object");
    }
    Logger.info("Confirming user after get user", getUserIdFromRequest(req), {
      data: {
        user_id: user?.id,
        user_email: user?.email,
      },
    });
    const userDto: UserDTO = await confirmUser(req, user);
    user = FromResponseUser(userDto, user?.token || "");
    return NextResponse.json({ result: user }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error confirming user", getUserIdFromRequest(req), {
      data: {
        user,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

async function confirmUser(req: NextRequest, user: User): Promise<UserDTO> {
  Logger.info("Confirming user function", user.id, {
    user,
  });
  if (!user) {
    throw new Error("Missing user object");
  }
  if (!user.id) {
    throw new Error("Missing user user id");
  }
  if (!user.email) {
    throw new Error("Missing user email");
  }

  const axios = GetAxiosInstance(req);
  const userDto = new UserDTO(user);
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
        Logger.error("Error getting user", getUserIdFromRequest(req), {
          data: {
            user,
          },
          error,
        });
        throw error;
      }
    } else {
      throw error;
    }
  }
}
