import GoodreadsData from "../goodreadsData";

class GoodreadsDataDTO {
  goodreads_rating?: number;
  goodreads_url?: string;
  goodreads_ratings_count?: number;
  updated_at?: string;

  constructor(
    goodreads_rating?: number,
    goodreads_url?: string,
    goodreads_ratings_count?: number,
    updated_at?: string
  ) {
    this.goodreads_rating = goodreads_rating;
    this.goodreads_url = goodreads_url;
    this.goodreads_ratings_count = goodreads_ratings_count;
    this.updated_at = updated_at;
  }
  static FromResponse(
    goodreadsDataDTO?: GoodreadsDataDTO
  ): GoodreadsData | undefined {
    return goodreadsDataDTO
      ? new GoodreadsData(
          goodreadsDataDTO.goodreads_rating,
          goodreadsDataDTO.goodreads_url,
          goodreadsDataDTO.goodreads_ratings_count,
          goodreadsDataDTO.updated_at
        )
      : undefined;
  }
}

export default GoodreadsDataDTO;
