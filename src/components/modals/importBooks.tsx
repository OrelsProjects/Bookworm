import React, { useEffect, useRef, useState } from "react";
import useImport from "@/src/hooks/useImport";
import { Button } from "../button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideModal } from "@/src/lib/features/modal/modalSlice";
import { EventTracker } from "@/src/eventTracker";
import { z } from "zod";
import { useFormik } from "formik";
import Loading from "../loading";
import { ImportStatusType } from "@/src/models/importStatus";
import { Logger } from "@/src/logger";

const ImportBooks = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const schema = z.object({
    goodreadsUrl: z
      .string()
      .regex(
        /^\d+-[\w-]+$/,
        "Is this the right URL? It should look like this: 123456789-wizard"
      ),
  });
  const formik = useFormik({
    initialValues: { goodreadsUrl: "" },
    onSubmit: async (values, { setErrors }) => {
      try {
        schema.parse(values);
        await handleImportViaGoodreadsUrl(values.goodreadsUrl);
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors({ goodreadsUrl: error.errors[0].message });
        }
      }
    },
  });

  const { importViaCSV, importViaGoodreadsUrl, loading, importStatus } =
    useImport();
  const [booksBeingImported, setBooksBeingImported] = useState<boolean>(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);

  useEffect(() => {
    Logger.info("importbooks modal open", {
      data: { loading, importStatus },
    });
  }, [loading, importStatus]);

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
    if (!fileSelected || loading) {
      return;
    }
    const toastId = toast.loading("Uploading file");
    try {
      EventTracker.track("User imported books via CSV");
      await importViaCSV(fileSelected);
      toast.success("Done!");
      setBooksBeingImported(true);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleImportViaGoodreadsUrl = async (goodreadsUrl: string) => {
    if (loading) {
      return;
    }
    const loadingToastId = toast.loading("Validating URL");
    try {
      EventTracker.track("User imported books via Goodreads URL");
      await importViaGoodreadsUrl(goodreadsUrl);
      toast.success("Done!");
      setBooksBeingImported(true);
    } catch (error: any) {
      toast.error("Something is wrong with your url 🤔");
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
        <Button
          variant="selected"
          className="rounded-full text-xl mt-4"
          onClick={() => dispatch(hideModal())}
        >
          Thanks
        </Button>
      </div>
    );
  }

  const ImportCSV = (): React.ReactNode => (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="flex w-full flex-col justify-center items-center mb-4">
        <div className="title">Import CSV</div>
        <div className="italic text-sm text-gray">
          hint: you can also import csv from goodreads export
        </div>
      </div>
      <div className="flex w-full flex-col justify-center items-center">
        <Button
          variant="selected"
          className="rounded-full"
          onClick={() => openFileExplorer()}
        >
          {fileSelected ? "Change CSV" : "Upload CSV"}
        </Button>
        {/* on click download file from public named exampleCSV.csv */}
        <Button
          variant="link"
          className="!p-0 h-fit"
          onClick={() => {
            if (typeof window === "undefined") return;
            const link = document.createElement("a");
            link.href = "/exampleCSV.csv";
            link.download = "exampleCSV.csv";
            link.click();
          }}
        >
          Download CSV Example
        </Button>
      </div>
      {fileSelected && (
        <div className="flex flex-col gap-2 items-center justify-center mt-3">
          <div className="text-foreground truncate flex flex-row gap-1 w-full">
            <div className="text-accent">File Selected:</div>
            <div className="truncate">{fileSelected.name}</div>
          </div>
          <Button
            variant="accent"
            className="w-fit"
            onClick={() => handleImportViaCSV()}
          >
            Start Importing!
          </Button>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv,.xls,.xlsx"
        onChange={handleFileChange}
      />
    </div>
  );

  const ImportGoodreads = (): React.ReactNode => (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div className="title mb-2">Import Your Goodreads List</div>
      <form onSubmit={formik.handleSubmit} className="w-comments flex flex-col">
        <label htmlFor="suggestion-source" className="">
          What is your goodreads profile id?
        </label>
        <input
          type="text"
          name="goodreadsUrl"
          id="suggestion-source"
          placeholder="123456789-wizard"
          onChange={formik.handleChange}
          value={formik.values.goodreadsUrl}
          className="w-full p-2 bg-primary-weak rounded-lg text-foreground placeholder-gray-500/70 focus:outline-none border-none"
        />
        {formik.errors.goodreadsUrl && formik.touched.goodreadsUrl && (
          <div className="text-error">{formik.errors.goodreadsUrl}</div>
        )}
        <div className="w-full flex justify-center items-center mt-2">
          <Button type="submit" variant="accent">
            Import via Goodreads URL
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="modal-size modal-background flex flex-col items-center justify-start gap-24">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loading spinnerClassName="!w-24 !h-24 !fill-primary" />
        </div>
      ) : importStatus?.importData.status === ImportStatusType.IN_PROGRESS ? (
        <div className="w-full h-full flex justify-center items-center text-4xl">
          We are still working on importing your books. We'll finish soon :)
        </div>
      ) : (
        <>
          <ImportCSV />
          {ImportGoodreads()}
        </>
      )}
    </div>
  );
};

export default ImportBooks;
