class GoodreadsDataDTO {
  book_id: string;
  goodreads_rating?: number;
  goodreads_url?: string;
  goodreads_ratings_count?: number;
  updated_at?: string;

  constructor(
    book_id: string,
    goodreads_rating?: number,
    goodreads_url?: string,
    goodreads_ratings_count?: number,
    updated_at?: string
  ) {
    this.book_id = book_id;
    this.goodreads_rating = goodreads_rating;
    this.goodreads_url = goodreads_url;
    this.goodreads_ratings_count = goodreads_ratings_count;
    this.updated_at = updated_at;
  }
}

export default GoodreadsDataDTO;
