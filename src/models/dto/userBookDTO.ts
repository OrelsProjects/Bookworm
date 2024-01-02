import { BookDTO, GenreDTO, GoodreadsDataDTO, ReadingStatusDTO } from "../dto";
import UserBook from "../userBook";
import { z } from "zod";

class UserBookDTO {
  book_id: number;
  reading_status_id: number;
  date_added?: string;
  is_deleted?: boolean;
  user_book_id: number;
  user_id?: string;
  is_favorite?: boolean;
  user_rating?: number;
  user_comments?: string;
  suggestion_source?: string;
  reading_start_date?: string;
  reading_finish_date?: string;

  constructor(
    book_id: number,
    reading_status_id: number,
    user_book_id: number,
    date_added?: string,
    is_deleted?: boolean,
    user_id?: string,
    is_favorite?: boolean,
    user_rating?: number,
    user_comments?: string,
    suggestion_source?: string,
    reading_start_date?: string,
    reading_finish_date?: string
  ) {
    this.user_book_id = user_book_id;
    this.user_id = user_id;
    this.book_id = book_id;
    this.reading_status_id = reading_status_id;
    this.date_added = date_added;
    this.is_deleted = is_deleted;
    this.is_favorite = is_favorite;
    this.user_rating = user_rating;
    this.user_comments = user_comments;
    this.suggestion_source = suggestion_source;
    this.reading_start_date = reading_start_date;
    this.reading_finish_date = reading_finish_date;
  }

  static schema = z.object({
    book_id: z.number(),
    reading_status_id: z.number(),
    date_added: z.string().optional(),
    is_deleted: z.boolean().optional(),
    user_book_id: z.number(),
    user_id: z.string().optional(),
    is_favorite: z.boolean().optional(),
    user_rating: z.number().optional(),
    user_comments: z.string().optional(),
    suggestion_source: z.string().optional(),
    reading_start_date: z.string().optional(),
    reading_finish_date: z.string().optional(),
  });

  static FromResponse(userBookDTO: UserBookDTO): UserBook {
    return new UserBook(
      userBookDTO.book_id,
      userBookDTO.user_book_id,
      userBookDTO.date_added,
      userBookDTO.reading_status_id,
      userBookDTO.is_deleted,
      userBookDTO.user_id,
      userBookDTO.is_favorite,
      userBookDTO.user_rating,
      userBookDTO.user_comments,
      userBookDTO.suggestion_source,
      userBookDTO.reading_start_date,
      userBookDTO.reading_finish_date
    );
  }
}

export type GetUserBooksResponseDTO = {
  user_book_id: number;
  user_id: string;
  suggestion_source?: string;
  user_comments?: string;
  date_added: string;
  user_rating?: number;
  reading_start_date?: string;
  reading_finish_date?: string;
  is_deleted: boolean;
  is_favorite: boolean;
  book_data: {
    book: BookDTO;
    main_genre?: GenreDTO;
    subgenres?: GenreDTO[];
    goodreads_data?: GoodreadsDataDTO;
  };
  reading_status: ReadingStatusDTO;
};

export type CreateUserBookBody = {
  book_id: number;
  is_favorite?: boolean;
  suggestion_source?: string;
  user_comments?: string;
  date_added?: string;
  user_rating?: number;
  reading_start_date?: string | Date;
  reading_finish_date?: string | Date;
  is_deleted?: boolean;
};

export type UpdateUserBookBody = {
  user_book_id: number;
  is_favorite?: boolean;
  suggestion_source?: string;
  user_comments?: string;
  date_added?: string;
  user_rating?: number;
  reading_start_date?: Date;
  reading_finish_date?: Date;
  reading_status_id?: number;
  is_deleted?: boolean;
};

export const GetUserBooksResponseSchema = z.object({
  user_book_id: z.number(),
  user_id: z.string(),
  suggestion_source: z.string().optional(),
  user_comments: z.string().optional(),
  date_added: z.string(),
  user_rating: z.number().optional(),
  reading_start_date: z.string().optional(),
  reading_finish_date: z.string().optional(),
  is_deleted: z.boolean(),
  is_favorite: z.boolean(),
  book_data: z.object({
    book: BookDTO.schema,
    main_genre: GenreDTO.schema.optional(),
    subgenres: z.array(GenreDTO.schema).optional(),
    goodreads_data: GoodreadsDataDTO.schema.optional(),
  }),
  reading_status: ReadingStatusDTO.schema,
});

export const CreateUserBookBodySchema = z.object({
  book_id: z.number(),
  is_favorite: z.boolean().optional(),
  suggestion_source: z.string().optional(),
  user_comments: z.string().optional(),
  date_added: z.string().optional(),
  user_rating: z.number().optional(),
  reading_start_date: z.string().optional(),
  reading_finish_date: z.string().optional(),
  is_deleted: z.boolean().optional(),
});

export const UpdateUserBookBodySchema = z.object({
  user_book_id: z.number(),
  is_favorite: z.boolean().optional(),
  suggestion_source: z.string().optional(),
  user_comments: z.string().optional(),
  date_added: z.string().optional(),
  user_rating: z.number().optional(),
  reading_start_date: z.string().optional(),
  reading_finish_date: z.string().optional(),
  reading_status_id: z.number().optional(),
  is_deleted: z.boolean().optional(),
});

export default UserBookDTO;
