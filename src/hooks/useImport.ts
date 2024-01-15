"use client";

import axios from "axios";
import { IResponse } from "../models/dto/response";
import { useEffect, useRef, useState } from "react";
import { Logger } from "../logger";
import { ImportStatus } from "../models";
import { ImportStatusType } from "../models/importStatus";

const LAST_STATUS_CHECK_TIME = "lastStatusCheckTime";
const LAST_STATUS = "lastStatus";
const TIME_BETWEEN_CHECKS = 1000 * 3 * 1; // 10 seconds

export type PresignedURL = {
  fileName: string;
  signedUrl: string;
};

const useImport = () => {
  const [loading, setLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus | undefined>(
    undefined
  );
  const loadingStatusCheck = useRef<boolean>(false);
  const statusCheckInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    startCheckingStatus();
    return () => {
      if (statusCheckInterval.current) {
        clearStatusInterval();
      }
    };
  }, []);

  const clearStatusInterval = () => {
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
      statusCheckInterval.current = undefined;
    }
  };

  const isLastStatusCheckTimeValid = (): boolean => {
    const lastTimeCheck = localStorage.getItem(LAST_STATUS_CHECK_TIME);
    if (!lastTimeCheck) {
      return true;
    }
    if (
      new Date().getTime() - new Date(lastTimeCheck).getTime() >=
      TIME_BETWEEN_CHECKS
    ) {
      return true;
    }
    return false;
  };

  const runStatusChecks = async (): Promise<void> => {
    if (
      loadingStatusCheck.current ||
      !isLastStatusCheckTimeValid() ||
      !statusCheckInterval.current
    ) {
      return;
    }
    loadingStatusCheck.current = true;
    setLoading(true);
    localStorage.setItem(LAST_STATUS_CHECK_TIME, new Date().toISOString());
    try {
      const response = await axios.get<IResponse<ImportStatus>>(
        "/api/import/status"
      );
      const importStatus: ImportStatus | undefined = response.data.result;
      setImportStatus(importStatus);
      localStorage.setItem(LAST_STATUS, JSON.stringify(importStatus));
      debugger;
      if (importStatus?.importData.status !== ImportStatusType.IN_PROGRESS) {
        clearStatusInterval();
      }
    } catch (error: any) {
      Logger.error("Error getting import status", {
        error,
      });
    } finally {
      loadingStatusCheck.current = false;
      setLoading(false);
    }
  };

  const startCheckingStatus = async (): Promise<void> => {
    if (statusCheckInterval.current) {
      clearStatusInterval();
    }
    const lastStatus = localStorage.getItem(LAST_STATUS);
    if (lastStatus) {
      const importStatus = JSON.parse(lastStatus) as ImportStatus;
      setImportStatus(importStatus);
      if (importStatus?.importData.status !== ImportStatusType.IN_PROGRESS) {
        setLoading(true);
      }
    }

    await runStatusChecks();
    const interval = setInterval(async () => {
      await runStatusChecks();
    }, TIME_BETWEEN_CHECKS);
    statusCheckInterval.current = interval;
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
      await startCheckingStatus();
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
      await startCheckingStatus();
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
    importStatus,
  };
};

export default useImport;
