import { Logger } from "@/src/logger";
import { UserBook, UserBookData } from "@/src/models";
import { IResponse } from "@/src/models/dto/response";
import {
  CreateUserBookBody,
  DeleteUserBookBody,
  UpdateUserBookBody,
} from "@/src/models/userBook";
import { GetAxiosInstance } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";
import { setThumbnailColorsToBooks } from "./_utils/thumbnailUtils";


export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<UserBookData[]>>> {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<UserBookData[]>("/user-book");
    const userBookData = response.data;
    const resultWithThumbnailColors = await setThumbnailColorsToBooks(
      userBookData
    );

    const result: IResponse<UserBookData[]> = {
      result: resultWithThumbnailColors,
    };
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting user books", {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let createUserBookBody: CreateUserBookBody | null = null;
  try {
    createUserBookBody = await req.json();
    const axios = GetAxiosInstance(req);
    const response = await axios.post<UserBook>(
      "/user-book",
      createUserBookBody
    );

    const userBook = response.data;

    return NextResponse.json(
      {
        result: userBook,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error("Error creating user book", {
      data: {
        createUserBookBody,
      },
      error,
    });

    return NextResponse.json({}, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest
): Promise<NextResponse<IResponse<UserBook>>> {
  let updateUserBookBody: UpdateUserBookBody | null = null;
  try {
    updateUserBookBody = await req.json();
    const axios = GetAxiosInstance(req);
    const response = await axios.patch<UserBook>(
      "/user-book",
      updateUserBookBody
    );
    const userBook: UserBook = response.data;
    return NextResponse.json({ result: userBook }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error updating user book", {
      data: {
        updateUserBookBody,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest
): Promise<NextResponse<IResponse<void>>> {
  let userBookId: string | null = null;
  try {
    const body = await req.json();
    userBookId = body.userBookId;
    if (!userBookId) throw new Error("userBookId is null");
    const axios = GetAxiosInstance(req);
    const data: DeleteUserBookBody = {
      userBookId: userBookId,
    };
    const response = await axios.delete<IResponse<void>>("/user-book", {
      data,
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    Logger.error("Error deleting user book", {
      data: {
        userBookId,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
