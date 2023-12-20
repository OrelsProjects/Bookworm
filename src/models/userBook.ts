class UserBook {
  bookId: number;
  userBookId?: number;
  userId?: string;
  readingStatusId?: number;
  dateAdded?: string;
  isDeleted?: boolean;
  isFavorite?: boolean;
  userRating?: number;
  userComments?: string;
  suggestionSource?: string;
  readingStartDate?: string;
  readingFinishDate?: string;

  constructor(
    bookId: number,
    readingStatusId?: number,
    dateAdded?: string,
    isDeleted?: boolean,
    userId?: string,
    userBookId?: number,
    isFavorite?: boolean,
    userRating?: number,
    userComments?: string,
    suggestionSource?: string,
    readingStartDate?: string,
    readingFinishDate?: string
  ) {
    this.userBookId = userBookId;
    this.userId = userId;
    this.bookId = bookId;
    this.readingStatusId = readingStatusId;
    this.dateAdded = dateAdded;
    this.isDeleted = isDeleted;
    this.isFavorite = isFavorite;
    this.userRating = userRating;
    this.userComments = userComments;
    this.suggestionSource = suggestionSource;
    this.readingStartDate = readingStartDate;
    this.readingFinishDate = readingFinishDate;
  }
}

export default UserBook;
