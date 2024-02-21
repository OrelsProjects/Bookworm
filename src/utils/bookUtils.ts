import { search } from "fast-fuzzy";
import { Book } from "../models";

const fuzzySearchOptions = {
  threshold: 0.8,
  returnEarly: true, // Stop searching after finding a good match
  ignoreCase: true,
};

export const removeSubtitle = (title: string) => {
  const mainTitle = title.split(/[:\(\)]/)[0].trim();
  return mainTitle;
};

const compareWithSubtitle = (title1: string, title2: string): boolean => {
  const similarity =
    search(title1, [title2], fuzzySearchOptions) ||
    search(title2, [title1], fuzzySearchOptions);
  return similarity.length > 0;
};

const compareWithoutSubtitle = (title1: string, title2: string): boolean => {
  const title1NoSubtitle = removeSubtitle(title1);
  const title2NoSubtitle = removeSubtitle(title2);
  const similarity =
    search(title1NoSubtitle, [title2NoSubtitle], fuzzySearchOptions) ||
    search(title2NoSubtitle, [title1NoSubtitle], fuzzySearchOptions);
  return similarity.length > 0;
};

const compareBooksByIsbn = (book1: Book, book2: Book): boolean => {
  if (book1.isbn && book2.isbn) {
    return book1.isbn === book2.isbn;
  } else if (book1.isbn10 && book2.isbn10) {
    return book1.isbn10 === book2.isbn10;
  }
  return false;
};

const compareBooksByTitle = (book1: Book, book2: Book): boolean => {
  const title1 = book1.title;
  const title2 = book2.title;
  const similarity =
    compareWithSubtitle(title1, title2) ||
    compareWithoutSubtitle(title1, title2);
  return similarity;
};

export const isBooksEqual = (
  book1?: Book | null,
  book2?: Book | null,
  threshold: number = 0.8
): boolean => {
  if (!book1 || !book2) {
    return false;
  }
  fuzzySearchOptions.threshold = threshold;
  return compareBooksByIsbn(book1, book2) || compareBooksByTitle(book1, book2);
};

export const isBooksEqualExactly = (
  book1?: Book | null,
  book2?: Book | null,
): boolean => {
  if (!book1 || !book2) {
    return false;
  }
  return compareBooksByIsbn(book1, book2) || book1.title === book2.title;
};
