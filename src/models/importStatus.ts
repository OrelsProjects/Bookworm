
export enum ImportStatusType {
  IN_PROGRESS = "In Progress",
  DONE = "Done",
  FAILED = "Failed",
}

export class ImportStatus {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  status: ImportStatusType;
  isDeleted: boolean;

  constructor(
    id: string,
    userId: string,
    startTime: string,
    status: ImportStatusType,
    isDeleted: boolean,
    endTime?: string
  ) {
    this.id = id;
    this.userId = userId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.status = status;
    this.isDeleted = isDeleted;
  }
}
