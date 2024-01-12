import { Logger } from "../logger";

export const FormatDate = (
  dateString: string | undefined
): string | undefined => {
  try {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let monthString = month.toString();
    let dayString = day.toString();

    if (month < 10) {
      monthString = `0${month}`;
    }
    if (day < 10) {
      dayString = `0${day}`;
    }

    return `${year}-${monthString}-${dayString}`;
  } catch (error: any) {
    Logger.error("Error formatting date", {
      data: {
        dateString,
      },
      error,
    });
    return dateString;
  }
};
