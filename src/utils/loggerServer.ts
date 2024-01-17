import { createLogger, format, transports } from "winston";
import "dotenv/config";

interface Dict {
  [key: string]: any;
}

interface Logger {
  debug: (message: string, user_id: string, data?: Dict) => void;
  info: (message: string, user_id: string, data?: Dict) => void;
  error: (message: string, user_id: string, data?: Dict) => void;
  warn: (message: string, user_id: string, data?: Dict) => void;
}

const httpTransportOptions = {
  host: process.env.NEXT_PUBLIC_DD_HOST,
  path: process.env.NEXT_PUBLIC_DD_PATH,
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
    data?: Dict
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
    if (process.env.NODE_ENV !== "production") {
      console.log(message, user_id, data);
    }
  };

  return {
    debug: (message: string, user_id: string, data?: Dict) =>
      log("debug", message, user_id, data),
    info: (message: string, user_id: string, data?: Dict) =>
      log("info", message, user_id, data),
    error: (message: string, user_id: string, data?: Dict) =>
      log("error", message, user_id, data),
    warn: (message: string, user_id: string, data?: Dict) =>
      log("warn", message, user_id, data),
  };
};

export default logger();
