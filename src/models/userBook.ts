class UserBook {
  userBookId: string;
  userId: string;
  bookId: string;
  readingStatusId: number;
  dateAdded: string;
  isDeleted: boolean;
  isFavorite?: boolean;
  userRating?: number;
  userComments?: string;
  suggestionSource?: string;
  readingStartDate?: string;
  readingFinishDate?: string;

  constructor(
    userBookId: string,
    userId: string,
    bookId: string,
    readingStatusId: number,
    dateAdded: string,
    isDeleted: boolean,
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
