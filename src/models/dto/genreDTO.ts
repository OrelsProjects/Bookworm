import Genre from "../genre";

class GenreDTO {
  genre_id: number;
  genre_name: string;

  constructor(genre_id: number, genre_name: string) {
    this.genre_id = genre_id;
    this.genre_name = genre_name;
  }

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
