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
    // Logger.error("Error confirming user", {
    //   data: {
    //     user,
    //   },
    //   error,
    // });
    return NextResponse.json({}, { status: 500 });
  }
}

async function confirmUser(req: NextRequest): Promise<UserDTO> {
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
    console.log("Creating user");
    const createUserResponse = await axios.post<UserDTO>("/user", {
      ...userDto,
    });
    console.log(createUserResponse.data);
    return createUserResponse.data;
  } catch (error: any) {
    console.log("Error on create user", error.response);
    if (error.response.status === 409) {
      console.log("User already exists, getting user");
      try {
        const getUserResponse = await getUser(req);
        return getUserResponse;
      } catch (error: any) {
        Logger.error("Error getting user", {
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

async function getUser(req: NextRequest): Promise<UserDTO> {
  const axios = GetAxiosInstance(req);
  console.log("Getting user");
  const response = await axios.get<UserDTO>("/user");
  console.log(response.data);
  return response.data;
}
