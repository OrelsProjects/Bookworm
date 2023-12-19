import { UserBookDataDTO } from "@/src/models/dto/userBookDTO";
import UserBookData from "@/src/models/userBookData";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<UserBookDataDTO[]>("/user-book");
    const userBookData: UserBookData[] = response.data?.map(
      (userBookDataDTO) => new UserBookData(userBookDataDTO)
    );

    return NextResponse.json(
      {
        result: userBookData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
