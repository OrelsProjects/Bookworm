"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/search/searchBar";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";

export default function Home(): React.ReactNode {
  const router = useRouter();
  const { userBooks, nextPage } = useTable();

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  return (
    <div className="h-full w-full flex flex-col relative justify-top items-start gap-4 p-3">
      <SearchBar />
      <div className="w-full flex flex-row justify-between">
        <div className="text-xl font-bold">Books I've Read</div>
        <div className="text-lg font-bold underline" onClick={onSeeAllClick}>
          See all
        </div>
      </div>
      <div className="w-full">
        <BookList
          books={userBooks.map((ubd) => ubd.bookData.book)}
          onNextPageScroll={nextPage}
          direction="row"
        />
      </div>
    </div>
  );
}

// interface BookProps {
//   book?: Book;
// }

// const BookComponent: React.FC<BookProps> = React.memo(({ book }) => {
//   const dispatch = useDispatch();
//   const onBookClick = () =>
//     dispatch(showBottomSheet({ book, type: BottomSheetTypes.BOOK_DETAILS }));

//   return (
//     book && (
//       <div className="text-foreground text-center flex flex-col justify-center items-center gap-2">
//         <div className="rounded-lg overflow-visible w-24 h-36 relative">
//           <img
//             src={book.thumbnailUrl ?? ""}
//             alt={book.title}
//             width={150}
//             height={200}
//             onClick={onBookClick}
//             className="!w-full !h-full rounded-lg"
//           />
//           <Add.Outline className="w-8 h-8 absolute -bottom-4 right-2 bg-background rounded-full border-none overflow-hidden" />
//         </div>
//         <div>
//           <div className="line-clamp-1 w-full text-left">
//             {removeSubtitle(book.title)}
//           </div>
//           <div className="line-clamp-1 w-full text-left text-primary">
//             {book.authors?.join(", ") ?? ""}
//           </div>
//         </div>
//       </div>
//     )
//   );
// });

// type BookListProps = {
//   books?: (Book | undefined)[];
//   onSeeAllClick?: () => void;
//   scrollableDivRef?: React.RefObject<HTMLDivElement>;
// };

// const BookList: React.FC<BookListProps> = ({
//   books,
//   onSeeAllClick,
//   scrollableDivRef,
// }) => {
//   return (
//     <div className="w-full overflow-auto flex flex-col gap-2">
//       <div className="w-full flex justify-between">
//         <div className="text-xl font-bold">Books I've Read</div>
//         <div className="text-lg font-bold underline" onClick={onSeeAllClick}>
//           See all
//         </div>
//       </div>
//       <div
//         className="flex flex-row gap-2 w-full overflow-auto"
//         ref={scrollableDivRef}
//       >
//         {books?.map((book, index) => (
//           <BookComponent key={index} book={book} />
//         ))}
//       </div>
//     </div>
//   );
// };
