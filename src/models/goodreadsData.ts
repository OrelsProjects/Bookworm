class GoodreadsData {
  goodreadsRating?: number;
  goodreadsUrl?: string;
  goodreadsRatingsCount?: number;
  updatedAt?: string;

  constructor(
    goodreadsRating?: number,
    goodreadsUrl?: string,
    goodreadsRatingsCount?: number,
    updatedAt?: string
  ) {
    this.goodreadsRating = goodreadsRating;
    this.goodreadsUrl = goodreadsUrl;
    this.goodreadsRatingsCount = goodreadsRatingsCount;
    this.updatedAt = updatedAt;
  }
}

export default GoodreadsData;
