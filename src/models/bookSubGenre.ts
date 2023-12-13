class BookSubGenre {
  bookId: number;
  subGenreId: string;

  constructor(bookId: number, genreName: string) {
    this.bookId = bookId;
    this.subGenreId = genreName;
  }
}

export default BookSubGenre;
