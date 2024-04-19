import { UserBookData } from "../../../../models";
import { getAverageColor } from "../../_utils/thumbnailUtils";

export async function setThumbnailColorsToBooks(
  userBooksData: UserBookData[]
): Promise<UserBookData[]> {
  const batchSize = 100;
  try {
    for (let i = 0; i < userBooksData.length; i += batchSize) {
      const batch = userBooksData.slice(i, i + batchSize);
      const colorPromises = batch.map(async (userBook) => {
        if (
          !userBook.bookData?.book?.thumbnailUrl ||
          userBook.bookData?.book?.thumbnailColor
        ) {
          return userBook;
        }
        const thumbnailColor = await getAverageColor(
          userBook.bookData.book.thumbnailUrl
        );
        userBook.bookData = {
          ...userBook.bookData,
          book: {
            ...userBook.bookData.book,
            thumbnailColor,
          },
        };
      });

      // Wait for the vibrant colors to be assigned for all books in the current batch
      await Promise.all(colorPromises);
    }
    return userBooksData;
  } catch (error: any) {
    return userBooksData;
  }
}
