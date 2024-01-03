export enum ReadingStatusEnum {
  READ = 1,
  TO_READ = 2,
}

export const DEFAULT_READING_STATUS = 2;

class ReadingStatus {
  readingStatusId: number;
  statusName: string;

  constructor(readingStatusId?: number, statusName?: string) {
    this.readingStatusId = readingStatusId ?? DEFAULT_READING_STATUS;
    this.statusName = statusName ?? "";
  }
}

export default ReadingStatus;
