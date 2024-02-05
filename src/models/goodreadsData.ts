class GoodreadsData {
  goodreadsRating?: number | null;
  goodreadsUrl?: string | null;
  goodreadsRatingsCount?: number | null;
  updatedAt?: string;

  constructor(
    goodreadsRating?: number | null,
    goodreadsUrl?: string | null,
    goodreadsRatingsCount?: number | null,
    updatedAt?: string
  ) {
    this.goodreadsRating = goodreadsRating;
    this.goodreadsUrl = goodreadsUrl;
    this.goodreadsRatingsCount = goodreadsRatingsCount;
    this.updatedAt = updatedAt;
  }
}

export default GoodreadsData;