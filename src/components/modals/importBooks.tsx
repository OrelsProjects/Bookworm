import { Book } from "@/src/models";
import React, { useRef, useState } from "react";
import BookComponent from "../search/bookComponent";
import useImport from "@/src/hooks/useImport";
import { Button } from "../button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideModal } from "@/src/lib/features/modal/modalSlice";

const ImportBooks = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { importViaCSV, importViaGoodreadsUrl, loading } = useImport();
  const [booksBeingImported, setBooksBeingImported] = useState<boolean>(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileSelected(file);
    }
  };

  const handleImportViaCSV = async () => {
    if (!fileSelected) {
      return;
    }
    const toastId = toast.loading("Uploading file");
    try {
      await importViaCSV(fileSelected);
      toast.success("Done!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading file");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleImportViaGoodreadsUrl = async () => {
    const loadingToastId = toast.loading("Validating URL");
    try {
      await importViaGoodreadsUrl("117647355-orel");
      toast.success("Done!");
      setBooksBeingImported(true);
    } catch (error) {
      console.error(error);
      toast.error("Error importing books");
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  if (booksBeingImported) {
    return (
      <div className="modal-size modal-background flex flex-col items-center justify-center">
        <div className="title">Your Books Are Being Imported As We Speak!</div>
        <div className="">
          It might take a few minutes until the process is complete
        </div>
        <Button variant="selected" className="rounded-full text-xl mt-4" onClick={() => dispatch(hideModal())}>
          Thanks
        </Button>
      </div>
    );
  }

  const ImportItem = (book: Book): React.ReactNode => (
    <BookComponent book={book} />
  );

  return (
    <div className="modal-size modal-background flex flex-col items-center justify-start">
      <div className="title">Import CSV</div>
      <Button
        variant="selected"
        className="rounded-full"
        onClick={() => openFileExplorer()}
      >
        Upload CSV
      </Button>
      {fileSelected && (
        <div className="flex flex-col gap-2">
          <div className="text-primary">Selected file: {fileSelected.name}</div>
          <Button variant="accent" onClick={() => handleImportViaCSV()}>
            Import CSV
          </Button>
        </div>
      )}
      <Button variant="link">Download CSV Example</Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv,.xls,.xlsx"
        onChange={handleFileChange}
      />
      <Button variant="accent" onClick={() => handleImportViaGoodreadsUrl()}>
        Import via Goodreads URL
      </Button>
    </div>
  );
};

export default ImportBooks;
