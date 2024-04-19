import Logger from "@/src/utils/loggerServer";
import { User } from "@/src/models";
import { IResponse } from "@/src/models/dto/response";
import { CreateUser } from "@/src/models/user";
import { GetAxiosInstance } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<CreateUser>>> {
  let user: CreateUser | undefined = undefined;
  try {
    const body = (await req.json()) as any;
    user = body.data.user as CreateUser;
    const fromList = body.data.fromList as string;
    if (!user) {
      throw new Error("Missing user object");
    }
    const axios = GetAxiosInstance(req);
    const response = await axios.post<CreateUser>("/user/confirm", {
      ...user,
      fromList,
    });
    const userResponse = response.data;
    return NextResponse.json({ result: userResponse }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error confirming user", user?.userId ?? "", {
      data: {
        user,
      },
      error,
    });
    throw error;
  }
}
