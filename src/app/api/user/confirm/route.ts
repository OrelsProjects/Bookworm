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
    const body = await req.json();
    user = body.data as User;
    Logger.info("Confirming user", user?.userId ?? "", {
      data: {
        user,
      },
    });
    if (!user) {
      throw new Error("Missing user object");
    }
    const axios = GetAxiosInstance(req);
    Logger.info("Confirming user", user?.userId ?? "", {
      data: {
        headers: req.headers,
      },
    });
    const response = await axios.post<CreateUser>("/user/confirm", {
      ...user,
    });
    Logger.info("Confirmed user", user?.userId ?? "", {
      data: {
        response: response.data,
      },
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
