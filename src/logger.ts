import { StatusType, datadogLogs } from "@datadog/browser-logs";
import dotenv from "dotenv";
import { User } from "./models";
dotenv.config();

export interface Dict {
  [key: string]: any;
}

export interface LogItem {
  data?: Dict;
  error?: Error;
}

export const initLogger = () => {
  try {
    const env = process.env.NODE_ENV ?? "dev";
    datadogLogs.init({
      clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN ?? "",
      site: process.env.NEXT_PUBLIC_DATADOG_SITE ?? "",
      forwardErrorsToLogs: true,
      sessionSampleRate: 100,
      service: process.env.NEXT_PUBLIC_DATADOG_SERVICE ?? "",
      env,
    });
    log(StatusType.debug, "Logger initialized", {});
  } catch (error: any) {
    Logger.error("Error initializing logger", {
      error,
    });
  }
};

export const setUserLogger = (user?: User | null) => {
  datadogLogs.setUser({
    id: user?.id,
    name: user?.name,
    email: user?.email,
  });
};

const log = (type: StatusType, message: string, logItem: LogItem) => {
  if (process.env.NODE_ENV !== "production") {
    printLog(type, message, logItem);
  }
  datadogLogs.logger.log(message, logItem.data, type, logItem.error);
};

const printLog = (type: StatusType, message: string, logItem: LogItem) => {
  switch (type) {
    case StatusType.info:
      console.info(message, logItem);
      break;
    case StatusType.warn:
      console.warn(message, logItem);
      break;
    case StatusType.error:
      console.error(message, logItem);
      break;
    case StatusType.debug:
      console.debug(message, logItem);
      break;
    default:
      console.log(message, logItem);
      break;
  }
};

export class Logger {
  static info(message: string, logItem: LogItem) {
    log(StatusType.info, message, logItem);
  }

  static warn(message: string, logItem: LogItem) {
    log(StatusType.warn, message, logItem);
  }

  static error(message: string, logItem: LogItem) {
    log(StatusType.error, message, logItem);
  }

  static debug(message: string, logItem: LogItem) {
    log(StatusType.debug, message, logItem);
  }
}
