import { StatusType, datadogLogs } from "@datadog/browser-logs";
import type { User } from "./models";

interface Dict {
  [key: string]: any;
}

export interface LogItem {
  data?: Dict;
  error?: Error;
}

let _logger: any;

export const initLogger = () => {
  try {
    const env = process.env.NODE_ENV ?? "development";
    datadogLogs.init({
      clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN ?? "",
      site: process.env.NEXT_PUBLIC_DATADOG_SITE ?? "",
      forwardErrorsToLogs: true,
      sessionSampleRate: 100,
      service: process.env.NEXT_PUBLIC_DATADOG_SERVICE ?? "",
      env,
    });
  } catch (error: any) {
    if (_logger) {
      _logger.error("Error initializing logger", { error });
    }
  }
};

export const setUserLogger = (user?: User | null) => {
  datadogLogs.setUser({
    id: user?.userId,
    name: user?.displayName,
    email: user?.email,
  });
};

const log = (type: StatusType, message: string, logItem?: LogItem) => {
  _logger.log({
    level: type,
    message,
    data: logItem?.data,
    error: logItem?.error,
  });
};

const printLog = (type: StatusType, message?: string, logItem?: LogItem) => {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  const logText = `${`${type}: ` ?? ""}${message ?? ""} ${
    logItem?.data ? JSON.stringify(logItem.data) : ""
  } ${logItem?.error ? JSON.stringify(logItem.error) : ""}
  }`;
  switch (type) {
    case StatusType.info:
      console.info(logText);
      break;
    case StatusType.warn:
      console.warn(logText);
      break;
    case StatusType.error:
      console.error(logText);
      break;
    case StatusType.debug:
      console.log(logText);
      break;
    default:
      console.log(message, logItem);
      break;
  }
};

export class Logger {
  static info(message: string, logItem?: LogItem) {
    log(StatusType.info, message, logItem);
  }

  static warn(message: string, logItem?: LogItem) {
    log(StatusType.warn, message, logItem);
  }

  static error(message: string, logItem?: LogItem) {
    log(StatusType.error, message, logItem);
  }

  static debug(message: string, logItem?: LogItem) {
    log(StatusType.debug, message, logItem);
  }
}
