import { BookInListWithBook } from "../../../../models/bookInList";
import { BooksListData } from "../../../../models/booksList";
import { getAverageColor } from "../../_utils/thumbnailUtils";

async function setThumbnailColorsToBooksInList(
  booksInListData: BookInListWithBook[]
): Promise<BookInListWithBook[]> {
  const batchSize = 100;
  const booksInListWithColors: BookInListWithBook[] = [];
  for (let i = 0; i < booksInListData.length; i += batchSize) {
    const batch = booksInListData.slice(i, i + batchSize);
    const colorPromises = batch.map(async (bookInList) => {
      if (!bookInList.book?.thumbnailUrl || bookInList.book?.thumbnailColor) {
        return bookInList;
      }
      const thumbnailColor = await getAverageColor(
        bookInList.book.thumbnailUrl
      );
      bookInList = {
        ...bookInList,
        book: {
          ...bookInList.book,
          thumbnailColor,
        },
      };
      return bookInList;
    });

    const newBooksInListWithColors: BookInListWithBook[] = await Promise.all(
      colorPromises
    );
    booksInListWithColors.push(...newBooksInListWithColors);
  }
  return booksInListWithColors;
}

export async function setThumbnailColorsToBooksListData(
  booksListData: BooksListData[]
): Promise<BooksListData[]> {
  try {
    for (const booksList of booksListData) {
      booksList.booksInList = await setThumbnailColorsToBooksInList(
        booksList.booksInList ?? []
      );
    }
    return booksListData;
  } catch (error: any) {
    return booksListData;
  }
}
