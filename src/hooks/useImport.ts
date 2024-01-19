"use client";

import axios from "axios";
import { IResponse } from "../models/dto/response";
import { useEffect, useRef, useState } from "react";
import { Logger } from "../logger";
import { ImportStatus } from "../models";
import { ImportStatusType } from "../models/importStatus";

const LAST_STATUS_CHECK_TIME_LOCAL_STORAGE_NAME = "lastStatusCheckTime";
const RETRY_CLICKED_LOCAL_STORAGE_NAME = "retryClicked";
const LAST_STATUS = "lastStatus";
const TIME_BETWEEN_CHECKS = 1000 * 10 * 1; // 10 seconds

export type PresignedURL = {
  fileName: string;
  signedUrl: string;
};

const useImport = () => {
  const [loading, setLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus | undefined>(
    undefined
  );

  useEffect(() => {
    if (getRetryClicked()) {
      return;
    }
    updateStatus();
  }, []);

  const getRetryClicked = (): boolean =>
    localStorage.getItem(RETRY_CLICKED_LOCAL_STORAGE_NAME) === "true";

  const retryUpload = async (): Promise<void> => {
    Logger.warn("User retry upload");
    localStorage.removeItem(LAST_STATUS_CHECK_TIME_LOCAL_STORAGE_NAME);
    localStorage.setItem(RETRY_CLICKED_LOCAL_STORAGE_NAME, "true");
    setImportStatus(undefined);
  };

  const updateStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get<IResponse<ImportStatus>>(
        "/api/import/status"
      );
      const importStatus: ImportStatus | undefined = response.data.result;

      setImportStatus(importStatus);
      localStorage.setItem(LAST_STATUS, JSON.stringify(importStatus));
    } catch (error: any) {
      Logger.error("Error getting import status", {
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinishImport = async () => {
    localStorage.removeItem(LAST_STATUS_CHECK_TIME_LOCAL_STORAGE_NAME);
    localStorage.removeItem(RETRY_CLICKED_LOCAL_STORAGE_NAME);
    await updateStatus();
  };

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
      handleFinishImport();
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

      await axios.put("api/import/custom-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleFinishImport();
    } catch (error: any) {
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

  return {
    importViaGoodreadsUrl,
    importViaCSV,
    loading,
    importStatus,
    retryUpload,
  };
};

export default useImport;
