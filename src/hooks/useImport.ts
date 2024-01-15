"use client";

import axios from "axios";
import { IResponse } from "../models/dto/response";
import { useState } from "react";
import { set } from "lodash";
import { Logger } from "../logger";

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
    } catch (error: any) {
      Logger.error("Error triggering goodreads import", {
        data: {
          goodreadsUserId,
          shelfName,
        },
        error,
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const importViaCSV = async (file: File): Promise<void> => {
    let presignedURL: PresignedURL | undefined = undefined;
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      await axios.put(
        "api/import/custom-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error: any) {
      debugger;
      Logger.error("Error uploading CSV", {
        data: {
          presignedURL,
        },
        error,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createUploadURL = async (
    file: File
  ): Promise<PresignedURL | undefined> => {
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await axios.post<IResponse<PresignedURL>>(
        "/api/import/custom-csv",
        {
          file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.result;
    } catch (error: any) {
      Logger.error("Error getting presigned url", {
        error,
      });
      return undefined;
    }
  };

  return {
    importViaGoodreadsUrl,
    importViaCSV,
    loading,
  };
};

export default useImport;
