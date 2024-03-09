import Logger from "@/src/utils/loggerServer";
import {
  GetAxiosInstance,
  getUserIdFromRequest,
  getTokenFromRequest,
} from "@/src/utils/apiUtils";
import { User } from "@/src/models";
import { IResponse } from "@/src/models/dto/response";
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
    if (!user.userId) {
      throw new Error("Missing user user id");
    }
    if (!user.email) {
      throw new Error("Missing user email");
    }
    const axios = GetAxiosInstance(req);
    await axios.post<IResponse<void>>("/user", {
      user,
    });
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error("Error creating user", getUserIdFromRequest(req), {
      error,
      user,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<User>>> {
  try {
    const axios = GetAxiosInstance(req);
    Logger.info("About to get user", getUserIdFromRequest(req), {
      headers: req.headers,
    });
    const response = await axios.get<User>("/user");
    const user = {
      ...response.data,
      token: getTokenFromRequest(req),
    };
    return NextResponse.json({ result: user }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting user", getUserIdFromRequest(req), {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
