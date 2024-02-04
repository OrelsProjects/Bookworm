class GoodreadsData {
  goodreadsRating?: number;
  goodreadsUrl?: string;
  goodreadsRatingsCount?: number;
  updatedAt?: string;

  constructor(
    goodreadsRating?: number,
    goodreadsUrl?: string,
    goodreadsRatingsCount?: number,
    updatedAt?: string
  ) {
    this.goodreadsRating = goodreadsRating;
    this.goodreadsUrl = goodreadsUrl;
    this.goodreadsRatingsCount = goodreadsRatingsCount;
    this.updatedAt = updatedAt;
  }
}

export default GoodreadsData;

const x = {
  book: {
    title: "Arrival",
    bookId: "32200035",
    authors: ["Ted Chiang"],
    numberOfPages: 279,
    isbn10: "0525433686",
    isbn: "9780525433682",
    datePublished: "2016",
    originalDatePublished: "2002",
    mainGenreId: 1,
    thumbnailUrl:
      "http://books.google.com/books/content?id=XNDGDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    description:
      'Previously published as Stories of Your Life and Others. Includes "Story Of Your Life," the basis for the major motion picture Arrival, starring Amy Adams, Forest Whitaker, Jeremy Renner, and directed by Denis Villeneuve. “A swell movie adaptation always sends me to the source material, so Arrival had me pick up Ted Chiang\'s Stories of Your Life and Others: lean, relentless, and incandescent.” —Colson Whitehead, GQ Ted Chiang has long been known as one of the most powerful science fiction writers working today. Offering readers the dual delights of the very strange and the heartbreakingly familiar, Arrival presents characters who must confront sudden change. In "Story of Your Life," which provides the basis for the film Arrival, alien lifeforms suddenly appear on Earth. When a linguist is brought in to help communicate with them and discern their intentions, her new knowledge of their language and its nonlinear structure allows her to see future events and all the joy and pain they may bring. In each story of this incredible collection, with sharp intelligence and humor, Ted Chiang examines what it means to be alive in a world marked by uncertainty, but also by wonder.',
  },
  readingStatus: {
    readingStatusId: 1,
    statusName: "read",
  },
  goodreadsData: {
    bookId: -1,
    goodreadsRating: 4.26,
  },
  isSuccess: false,
};
