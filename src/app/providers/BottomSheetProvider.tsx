"use client";

import {
  BottomSheetState,
  BottomSheetTypes,
  hideBottomSheet,
} from "@/src/lib/features/modal/modalSlice";
import { RootState } from "@/src/lib/store";
import { Book } from "@/src/models";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheet } from "../../components";
import AddBookToBacklog, {
  ListType,
} from "../../components/bottomSheet/addBookToList";
import ModalBookDetails from "../../components/bottomSheet/modalBookDetails";

type RenderComponentProps = {
  book?: Book;
};

const BottomSheetProvider: React.FC = () => {
  const { data, type, isOpen }: BottomSheetState = useSelector(
    (state: RootState) => state.modal
  );

  const dispatch = useDispatch();

  const RenderComponent = useCallback(() => {
    switch (type) {
      case BottomSheetTypes.BOOK_DETAILS:
        return RenderBookDetails(data);
      // case BottomSheetTypes.ADD_BOOK_TO_BACKLOG:
      //   return RenderAddBookToBacklog(data, ListType.BACKLOG);
      // case BottomSheetTypes.ADD_BOOK_TO_READ_LIST:
      //   return RenderAddBookToBacklog(data, ListType.READ);
      default:
        return null;
    }
  }, [data, type]);

  // const RenderAddBookToBacklog = (book?: Book) => (
  //   book && <AddBookToBacklog book={book} type={type} />
  // );

  const RenderBookDetails = (book?: Book) =>
    book && <ModalBookDetails book={book} />;

  return (
    isOpen && (
      <div className="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen">
        <BottomSheet
          isOpen={isOpen}
          onClose={() => dispatch(hideBottomSheet())}
          backgroundColor={data?.thumbnailColor}
        >
          <RenderComponent />
        </BottomSheet>
      </div>
    )
  );
};

export default BottomSheetProvider;
