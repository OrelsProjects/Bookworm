import { Logger } from "@/src/logger";
import { User } from "@/src/models";
import { IResponse } from "@/src/models/dto/response";
import { UserDTO } from "@/src/models/dto/userDTO";
import { FromResponseUser } from "@/src/models/user";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<User>>> {
  let user: User | undefined = undefined;
  try {
    const userDto: UserDTO = await confirmUser(req);
    user = FromResponseUser(userDto);
    return NextResponse.json({ result: user }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error creating user", {
      data: {
        user,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function confirmUser(req: NextRequest): Promise<UserDTO> {
  let user: User | undefined = undefined;
  const body = await req.json();
  user = body.data;

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
  axios.defaults.headers.common["Authorization"] = `Bearer ${user?.token}`;
  axios.defaults.headers.common["user_id"] = user?.id;

  const userDto = new UserDTO(user);
  try {
    const createUserResponse = await axios.post<UserDTO>("/user", {
      ...userDto,
    });
    return createUserResponse.data;
  } catch (error: any) {
    if (error.response.status === 409) {
      const getUserResponse = await getUser(req);
      return getUserResponse;
    } else {
      throw error;
    }
  }
}

export async function getUser(req: NextRequest): Promise<UserDTO> {
  const axios = GetAxiosInstance(req);
  const response = await axios.get<UserDTO>("/user");
  return response.data;
}
