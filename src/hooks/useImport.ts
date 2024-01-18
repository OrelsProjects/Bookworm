"use client";

import axios from "axios";
import { IResponse } from "../models/dto/response";
import { useEffect, useRef, useState } from "react";
import { Logger } from "../logger";
import { ImportStatus } from "../models";
import { ImportStatusType } from "../models/importStatus";

const LAST_STATUS_CHECK_TIME = "lastStatusCheckTime";
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

  const isLastStatusDone = (): boolean => {
    const lastStatus = localStorage.getItem(LAST_STATUS);
    if (!lastStatus) {
      return true;
    }
    const importStatus = JSON.parse(lastStatus) as ImportStatus;
    return importStatus?.importData.status === ImportStatusType.DONE;
  };

  const runStatusChecks = async (): Promise<void> => {
    Logger.info("Running status check", {
      data: {
        loadingStatusCheck: loadingStatusCheck.current,
        isLastStatusCheckTimeValid: isLastStatusCheckTimeValid(),
        isLastStatusDone: isLastStatusDone(),
      },
    });
    if (
      loadingStatusCheck.current ||
      !isLastStatusCheckTimeValid() ||
      !statusCheckInterval.current ||
      isLastStatusDone()
    ) {
      return;
    }
    Logger.info("Running status check");
    loadingStatusCheck.current = true;
    setLoading(true);
    localStorage.setItem(LAST_STATUS_CHECK_TIME, new Date().toISOString());
    Logger.info("Last status check time set");
    try {
      const response = await axios.get<IResponse<ImportStatus>>(
        "/api/import/status"
      );
      const importStatus: ImportStatus | undefined = response.data.result;
      setImportStatus(importStatus);
      localStorage.setItem(LAST_STATUS, JSON.stringify(importStatus));
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

  const startCheckingStatus = async (
    defaultStatus?: ImportStatusType
  ): Promise<void> => {
    if (statusCheckInterval.current) {
      clearStatusInterval();
    }
    if (defaultStatus) {
      setImportStatus({
        importData: {
          id: "",
          userId: "",
          startTime: "",
          status: defaultStatus,
          isDeleted: false,
        },
      });
      setLoading(
        importStatus?.importData.status === ImportStatusType.IN_PROGRESS
      );
    } else {
      const lastStatus = localStorage.getItem(LAST_STATUS);
      if (lastStatus) {
        const importStatus = JSON.parse(lastStatus) as ImportStatus;
        setImportStatus(importStatus);
        if (importStatus?.importData.status !== ImportStatusType.IN_PROGRESS) {
          setLoading(true);
        }
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
      await startCheckingStatus(ImportStatusType.IN_PROGRESS);
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
      await startCheckingStatus(ImportStatusType.IN_PROGRESS);
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
  };
};

export default useImport;
