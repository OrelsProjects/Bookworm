class GenreDTO {
  genreId: number;
  genreName: string;

  constructor(genreId: number, genreName: string) {
    this.genreId = genreId;
    this.genreName = genreName;
  }
}

export default GenreDTO;
