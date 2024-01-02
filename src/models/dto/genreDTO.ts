import Genre from "../genre";
import { z } from "zod";

class GenreDTO {
  genre_id: number;
  genre_name: string;

  constructor(genre_id: number, genre_name: string) {
    this.genre_id = genre_id;
    this.genre_name = genre_name;
  }

  static schema = z.object({
    genre_id: z.number(),
    genre_name: z.string(),
  });

  static FromResponse = (genreDTO?: GenreDTO): Genre | undefined =>
    genreDTO ? new Genre(genreDTO.genre_id, genreDTO.genre_name) : undefined;
  static FromResponseArray = (
    genreDTOs?: GenreDTO[]
  ): (Genre | undefined)[] | undefined =>
    genreDTOs
      ? genreDTOs.map((genreDTO) => GenreDTO.FromResponse(genreDTO))
      : undefined;
}

export default GenreDTO;
