import moment from "moment-timezone";
import { Logger } from "../logger";

export const formatDate = (
  dateString: string | undefined,
  withHours: boolean = true,
  withMinutes: boolean = true,
  withSeconds: boolean = true
): string | undefined => {
  try {
    if (!dateString) return "";

    // Detect the user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let date = moment.tz(dateString, timezone); // Convert to the user's timezone
    if (!date.isValid()) return "";
    
    let formatString = "YYYY-MM-DD";
    if (withHours) {
      formatString += ", HH";
      if (withMinutes) {
        formatString += ":mm";
        if (withSeconds) {
          formatString += ":ss";
        }
      }
    }

    return date.format(formatString);
  } catch (error: any) {
    Logger.error("Error formatting date", {
      data: {
        dateString,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      error,
    });
    return dateString;
  }
};
