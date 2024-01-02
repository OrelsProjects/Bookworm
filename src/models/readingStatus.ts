export enum ReadingStatusEnum {
  READ = 1,
  TO_READ = 2,
}

class ReadingStatus {
  readingStatusId: number;
  statusName: string;

  constructor(readingStatusId: number, statusName: string) {
    this.readingStatusId = readingStatusId;
    this.statusName = statusName;
  }
}

export default ReadingStatus;
