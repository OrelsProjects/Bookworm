export type ReadStatus = "read" | "to-read";

enum ReadingStatusNameEnum {
  READ = "read",
  TO_READ = "to-read",
}

export enum ReadingStatusEnum {
  READ = 1,
  TO_READ = 2,
}

export const readingStatusToName = (readingStatus: ReadingStatusEnum) => {
  switch (readingStatus) {
    case ReadingStatusEnum.READ:
      return ReadingStatusNameEnum.READ;
    case ReadingStatusEnum.TO_READ:
      return ReadingStatusNameEnum.TO_READ;
  }
};

export const DEFAULT_READING_STATUS = 2;

class ReadingStatus {
  readingStatusId: ReadingStatusEnum;
  statusName: string;

  constructor(readingStatusId?: ReadingStatusEnum, statusName?: string) {
    this.readingStatusId = readingStatusId ?? DEFAULT_READING_STATUS;
    this.statusName = statusName ?? "";
  }
}

export default ReadingStatus;
