import { Book, UserBook, UserBookData } from "@/src/models";
import {
  BookDTO,
  GenreDTO,
  GoodreadsDataDTO,
  ReadingStatusDTO,
} from "@/src/models/dto";
import { IResponse } from "@/src/models/dto/response";
import UserBookDTO, {
  CreateUserBookBody,
  GetUserBooksResponseDTO,
} from "@/src/models/dto/userBookDTO";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

const userBookDataDTOFromResponse = (
  userBookDataDTO: GetUserBooksResponseDTO
) =>
  new UserBookData(
    {
      book: BookDTO.FromResponse(userBookDataDTO.book_data.book),
      mainGenre: GenreDTO.FromResponse(userBookDataDTO.book_data.main_genre),
      subgenres: userBookDataDTO.book_data.subgenres?.map((subgenre) =>
        GenreDTO.FromResponse(subgenre)
      ),
    },
    ReadingStatusDTO.FromResponse(userBookDataDTO.reading_status),
    userBookDataDTO.user_book_id,
    userBookDataDTO.user_id,
    userBookDataDTO.suggestion_source,
    userBookDataDTO.user_comments,
    userBookDataDTO.date_added,
    userBookDataDTO.user_rating,
    userBookDataDTO.reading_start_date,
    userBookDataDTO.reading_finish_date,
    userBookDataDTO.is_deleted,
    userBookDataDTO.is_favorite,
    GoodreadsDataDTO.FromResponse(userBookDataDTO.goodreads_data)
  );

export async function GET(req: NextRequest) {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<GetUserBooksResponseDTO[]>("/user-book");
    const userBookData = response.data?.map((getUserBooksResponseDTO) =>
      userBookDataDTOFromResponse(getUserBooksResponseDTO)
    );
    const result: IResponse<UserBookData[]> = {
      result: userBookData,
    };
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { createUserBookBody }: { createUserBookBody: CreateUserBookBody } =
      await req.json();
    const axios = GetAxiosInstance(req);
    const response = await axios.post<UserBookDTO>(
      "/user-book",
      createUserBookBody
    );

    const userBookDTO = response.data;
    const userBook = UserBookDTO.FromResponse(userBookDTO);

    return NextResponse.json(
      {
        result: [userBook],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
