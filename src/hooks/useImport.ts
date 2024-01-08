"use client";

import axios from "axios";
import { IResponse } from "../models/dto/response";

export type PresignedURL = {
  fileName: string;
  signedUrl: string;
};

const useImport = () => {
  const importViaGoodreadsUrl = async (
    goodreadsUserId: string,
    shelfName: string = ""
  ): Promise<void> => {
    try {
      console.log("importViaGoodreadsUrl");
      console.log(goodreadsUserId);
      console.log(shelfName);
      const response = await axios.post<IResponse<void>>(
        "/api/import/goodreads",
        null,
        {
          params: {
            goodreadsUserId,
            shelfName,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to import books");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const importViaCSV = async (file: File): Promise<void> => {
    try {
      const uploadURL = await createUploadURL();
      debugger;
      if (!uploadURL) {
        throw new Error("Failed to create upload URL");
      }
      const response = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      // await axios.put(uploadURL, file, {
      //   headers: {
      //     "Content-Type": file.type,
      //   },
      // });
      if (response.status !== 200) {
        throw new Error("Failed to upload CSV");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createUploadURL = async (): Promise<string | undefined> => {
    try {
      const response = await axios.get<IResponse<PresignedURL>>(
        "/api/import/presigned-url"
      );
      return response.data.result?.signedUrl;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    importViaGoodreadsUrl,
    importViaCSV,
  };
};

export default useImport;
