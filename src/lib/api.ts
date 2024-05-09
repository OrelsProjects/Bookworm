import axios from "axios";
import { SafeBooksListData } from "../models/booksList";
import { IResponse } from "../models/dto/response";
import { SearchResults } from "../models/search";
import { Book } from "../models";

export const searchBooks = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<Book[] | undefined> => {
  const response = await axios.get<IResponse<Book[]>>(
    `/api/books/search/${query}/${page}/${limit}`
  );
  return response.data.result;
};

export const searchAll = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<SearchResults | undefined> => {
  const response = await axios.get<IResponse<SearchResults>>(
    `api/search/${query}/${page}/${limit}`
  );
  return response.data.result;
};

export const getListsByGenre = async ({
  page,
  limit,
  genre,
}: {
  page: number;
  limit: number;
  genre: string;
}): Promise<SafeBooksListData[]> => {
  const response = await axios.get<IResponse<SafeBooksListData[]>>(
    `api/lists/by-genre/${genre}/${limit}/${page}`
  );
  return response.data.result || [];
};

export const getTopGenres = async (): Promise<string[]> => {
  const response = await axios.get<IResponse<string[]>>("api/lists/top-genres");
  return response.data.result || [];
};
