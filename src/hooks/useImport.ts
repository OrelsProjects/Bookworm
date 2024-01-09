"use client";

import axios from "axios";
import { IResponse } from "../models/dto/response";
import { useState } from "react";
import { set } from "lodash";

export type PresignedURL = {
  fileName: string;
  signedUrl: string;
};

const useImport = () => {
  const [loading, setLoading] = useState(false);

  const importViaGoodreadsUrl = async (
    goodreadsUserId: string,
    shelfName: string = ""
  ): Promise<void> => {
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  };

  const importViaCSV = async (file: File): Promise<void> => {
    try {
      setLoading(true);
      const presignedURL = await createUploadURL();
      if (!presignedURL) {
        throw new Error("Failed to create upload URL");
      }
      const fileToUpload = new File([file], presignedURL.fileName, {
        type: file.type,
      });
      const response = await fetch(presignedURL.signedUrl, {
        method: "PUT",
        body: fileToUpload,
        headers: {
          "Content-Type": fileToUpload.type,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to upload CSV");
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createUploadURL = async (): Promise<PresignedURL | undefined> => {
    try {
      const response = await axios.get<IResponse<PresignedURL>>(
        "/api/import/presigned-url"
      );
      return response.data.result;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    importViaGoodreadsUrl,
    importViaCSV,
    loading,
  };
};

export default useImport;
