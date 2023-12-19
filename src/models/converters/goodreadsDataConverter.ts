import GoodreadsData from "../goodreadsData";
import GoodreadsDataDTO from "../dto/goodreadsDataDTO";

export function convertToGoodreadsData(
  goodreadsDataDTO: GoodreadsDataDTO
): GoodreadsData {
  return new GoodreadsData(
    goodreadsDataDTO.book_id,
    goodreadsDataDTO.goodreads_rating,
    goodreadsDataDTO.goodreads_url,
    goodreadsDataDTO.goodreads_ratings_count,
    goodreadsDataDTO.updated_at
  );
}

export function convertToGoodreadsDataDTO(
  goodreadsData: GoodreadsData
): GoodreadsDataDTO {
  return new GoodreadsDataDTO(
    goodreadsData.bookId,
    goodreadsData.goodreadsRating,
    goodreadsData.goodreadsUrl,
    goodreadsData.goodreadsRatingsCount,
    goodreadsData.updatedAt
  );
}
