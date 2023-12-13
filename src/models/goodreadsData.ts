class GoodreadsData {
  bookId: string;
  goodreadsRating?: number;
  goodreadsUrl?: string;
  goodreadsRatingsCount?: number;
  updatedAt?: string;

  constructor(
    bookId: string,
    goodreadsRating?: number,
    goodreadsUrl?: string,
    goodreadsRatingsCount?: number,
    updatedAt?: string
  ) {
    this.bookId = bookId;
    this.goodreadsRating = goodreadsRating;
    this.goodreadsUrl = goodreadsUrl;
    this.goodreadsRatingsCount = goodreadsRatingsCount;
    this.updatedAt = updatedAt;
  }
}

export default GoodreadsData;
