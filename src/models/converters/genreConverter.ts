import Genre from '../genre';
import GenreDTO from '../dto/genreDTO';

export function convertToGenre(genreDTO: GenreDTO): Genre {
  return new Genre(
    genreDTO.genre_id,
    genreDTO.genre_name
  );
}

export function convertToGenreDTO(genre: Genre): GenreDTO {
  return new GenreDTO(
    genre.genreId,
    genre.genreName
  );
}
