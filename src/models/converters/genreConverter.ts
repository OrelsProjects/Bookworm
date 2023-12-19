import Genre from '../genre';
import GenreDTO from '../dto/genreDTO';

export function convertToGenre(genreDTO: GenreDTO): Genre {
  return new Genre(
    genreDTO.genreId,
    genreDTO.genreName
  );
}

export function convertToGenreDTO(genre: Genre): GenreDTO {
  return new GenreDTO(
    genre.genreId,
    genre.genreName
  );
}
