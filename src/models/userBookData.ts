import Book from "./book";
import { convertToBook } from "./converters/bookConverter";
import { convertToGoodreadsData } from "./converters/goodreadsDataConverter";
import { convertToReadingStatus } from "./converters/readingStatusConverter";
import { UserBookDataDTO } from "./dto/userBookDTO";
import Genre from "./genre";
import GoodreadsData from "./goodreadsData";
import ReadingStatus from "./readingStatus";

class UserBookData {
  userBookId: number;
  userId: string;
  suggestionSource?: string;
  userComments?: string;
  dateAdded: string;
  userRating?: number;
  readingStartDate?: string;
  readingFinishDate?: string;
  isDeleted: boolean;
  isFavorite: boolean;
  bookData: {
    book: Book;
    mainGenre: Genre;
    subgenres: Genre[];
    goodreadsData?: GoodreadsData;
  };
  readingStatus: ReadingStatus;

  constructor(userBookData: UserBookDataDTO) {
    this.userBookId = userBookData.user_book_id;
    this.userId = userBookData.user_id;
    this.suggestionSource = userBookData.suggestion_source;
    this.userComments = userBookData.user_comments;
    this.dateAdded = userBookData.date_added;
    this.userRating = userBookData.user_rating;
    this.readingStartDate = userBookData.reading_start_date;
    this.readingFinishDate = userBookData.reading_finish_date;
    this.isDeleted = userBookData.is_deleted;
    this.isFavorite = userBookData.is_favorite;
    this.bookData = {
      book: convertToBook(userBookData.book_data.book),
      mainGenre: userBookData.book_data.main_genre,
      subgenres: userBookData.book_data.subgenres,
      goodreadsData: userBookData.book_data.goodreads_data
        ? convertToGoodreadsData(userBookData.book_data.goodreads_data)
        : new GoodreadsData(""),
    };
    this.readingStatus = convertToReadingStatus(userBookData.reading_status);
  }
}

export default UserBookData;
