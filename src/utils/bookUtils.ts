import { search } from "fast-fuzzy";
import { Book, UserBookData } from "../models";
import { BooksListData } from "../models/booksList";

const fuzzySearchOptions = {
  threshold: 0.8,
  returnEarly: true, // Stop searching after finding a good match
  ignoreCase: true,
};

export const removeSubtitle = (title: string) => {
  const mainTitle = title.split(/[:\-\(\)]/)[0].trim();
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
  threshold: number = 0.95
): boolean => {
  if (!book1 || !book2) {
    return false;
  }
  if (book1.bookId === book2.bookId) {
    return true;
  }
  fuzzySearchOptions.threshold = threshold;
  return compareBooksByIsbn(book1, book2) || compareBooksByTitle(book1, book2);
};

export const isBooksEqualExactly = (
  book1?: Book | null,
  book2?: Book | null
): boolean => {
  if (!book1 || !book2) {
    return false;
  }
  return (
    compareBooksByIsbn(book1, book2) ||
    book1.title === book2.title ||
    book1.bookId === book2.bookId
  );
};

export const sortByTitle = (userBookData: UserBookData[]): UserBookData[] =>
  userBookData?.sort((a, b) => {
    if (a.bookData?.book?.title && b.bookData?.book?.title) {
      const firstLetterA = a.bookData.book.title.charAt(0).toLowerCase();
      const firstLetterB = b.bookData.book.title.charAt(0).toLowerCase();
      if (firstLetterA < firstLetterB) return -1;
      if (firstLetterA > firstLetterB) return 1;
      return 0;
    }
    return 0;
  });

export const sortByAuthor = (userBookData: UserBookData[]): UserBookData[] =>
  userBookData?.sort((a, b) => {
    if (a.bookData?.book?.authors && b.bookData?.book?.authors) {
      const firstAuthorLetterA = a.bookData.book.authors?.[0]
        ?.charAt(0)
        ?.toLowerCase();
      const firstAuthorLetterB = b.bookData.book.authors?.[0]
        ?.charAt(0)
        ?.toLowerCase();
      return firstAuthorLetterA.localeCompare(firstAuthorLetterB);
    }
    return 0;
  });

export const sortByDateAdded = (userBookData: UserBookData[]): UserBookData[] =>
  userBookData?.sort((a, b) => {
    if (a.userBook.dateAdded && b.userBook.dateAdded) {
      const dateAddedA = new Date(a.userBook.dateAdded);
      const dateAddedB = new Date(b.userBook.dateAdded);
      return dateAddedB.getTime() - dateAddedA.getTime();
    }
    return 0;
  });

export const filterByReadlist = (
  listName: string,
  userBooks: UserBookData[],
  booksLists: BooksListData[],
  exactly: boolean = false
): UserBookData[] => {
  const list = booksLists.find((list) => list.name === listName);
  const booksInList = list?.booksInList.map((listData) => listData.book);
  if (exactly) {
    return userBooks.filter((userBook) =>
      booksInList?.some((book) =>
        isBooksEqualExactly(book, userBook.bookData?.book)
      )
    );
  } else {
    return userBooks.filter((userBook) =>
      booksInList?.some((book) => isBooksEqual(book, userBook.bookData?.book))
    );
  }
};
