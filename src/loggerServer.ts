import { createLogger, format, transports } from "winston";
import { LogItem } from "./logger";

interface Logger {
  debug: (message: string, user_id: string, data?: LogItem) => void;
  info: (message: string, user_id: string, data?: LogItem) => void;
  error: (message: string, user_id: string, data?: LogItem) => void;
  warn: (message: string, user_id: string, data?: LogItem) => void;
}

const httpTransportOptions = {
  host: process.env.DD_HOST,
  path: process.env.DD_PATH,
  ssl: true,
};

const _logger = createLogger({
  level: "info",
  exitOnError: false,
  format: format.json(),
  transports: [new transports.Http(httpTransportOptions)],
});

const logger: () => Logger = () => {
  const log = (
    level: "info" | "error" | "warn" | "debug",
    message: string,
    user_id: string,
    data?: LogItem,
  ) => {
    try {
      _logger.log(level, message, {
        user_id,
        data,
        env: process.env.NODE_ENV,
      });
    } catch (error: any) {
      console.log("Error logging", error);
    }

    switch (level) {
      case "info":
        console.info(message, user_id, data);
        break;
      case "error":
        console.error(message, user_id, data);
        break;
      case "warn":
        console.warn(message, user_id, data);
        break;
      case "debug":
        console.debug(message, user_id, data);
        break;
      default:
        console.log(message, user_id, data);
        break;
    }
  };

  return {
    debug: (message: string, user_id: string, data?: LogItem) =>
      log("debug", message, user_id, data),
    info: (message: string, user_id: string, data?: LogItem) =>
      log("info", message, user_id, data),
    error: (message: string, user_id: string, data?: LogItem) =>
      log("error", message, user_id, data),
    warn: (message: string, user_id: string, data?: LogItem) =>
      log("warn", message, user_id, data),
  };
};

export default logger();
