import React from "react";
import { useModal } from "../hooks/useModal";
import { Add } from "./icons/add";

export const EmptyList = ({
  searchValue,
  classNameButton,
}: {
  searchValue?: string;
  classNameButton?: string;
}) => {
  const { showBooksListEditModal } = useModal();
  return (
    <div className="mt-3 w-fit h-fit flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        {!searchValue && (
          <>
            <div className="text-base font-bold">
              You have no Readlists for now :(
            </div>
            <div className="text-base font-light">
              Ready to create and share your Readlist with friends? Spread the
              joy of reading by inviting them to join in!
            </div>
            <div
              className={`w-full h-fit flex flex-row gap-2 rounded-full text-background bg-foreground p-2 ${classNameButton}`}
              onClick={() => showBooksListEditModal()}
            >
              <Add.Fill className="!text-background" iconSize="sm" />
              Create your first shareable Readlist
            </div>
          </>
        )}
      </div>
    </div>
  );
};
