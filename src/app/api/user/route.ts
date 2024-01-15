import { Logger } from "@/src/logger";
import { User } from "@/src/models";
import { IResponse } from "@/src/models/dto/response";
import { UserDTO } from "@/src/models/dto/userDTO";
import { FromResponseUser } from "@/src/models/user";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<void>>> {
  let user: User | undefined = undefined;
  try {
    const body = await req.json();
    user = body.user;
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
    await axios.post<IResponse<void>>("/user", {
      userDto,
    });
    return NextResponse.json({}, { status: 200 });
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

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<User>>> {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<UserDTO>("/user");
    const user = FromResponseUser(response.data);
    return NextResponse.json({ result: user }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting user", {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
