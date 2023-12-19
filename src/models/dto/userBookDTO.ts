import { BookDTO, GenreDTO, GoodreadsDataDTO, ReadingStatusDTO } from "../dto";

class UserBookDTO {
  user_book_id: string;
  user_id: string;
  book_id: string;
  reading_status_id: number;
  date_added: string;
  is_deleted: boolean;
  is_favorite?: boolean;
  user_rating?: number;
  user_comments?: string;
  suggestion_source?: string;
  reading_start_date?: string;
  reading_finish_date?: string;

  constructor(
    user_book_id: string,
    user_id: string,
    book_id: string,
    reading_status_id: number,
    date_added: string,
    is_deleted: boolean,
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
}

export type UserBookDataDTO = {
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
    main_genre: GenreDTO;
    subgenres: GenreDTO[];
    goodreads_data?: GoodreadsDataDTO;
  };
  reading_status: ReadingStatusDTO;
};

export default UserBookDTO;
