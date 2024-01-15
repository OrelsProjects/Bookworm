import { ImportStatusDTO } from "./dto/importStatusDTO";

export enum ImportStatusType {
  IN_PROGRESS = "In Progress",
  DONE = "Done",
  FAILED = "Failed",
}

export class ImportData {
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

export function FromResponseImportStatus(importStatusDTO: ImportStatusDTO) {
  const importData = new ImportData(
    importStatusDTO.import_data.id,
    importStatusDTO.import_data.user_id,
    importStatusDTO.import_data.start_time,
    importStatusDTO.import_data.status,
    importStatusDTO.import_data.is_deleted,
    importStatusDTO.import_data.end_time
  );

  return new ImportStatus(importData);
}

export class ImportStatus {
  importData: ImportData;

  constructor(importData: ImportData) {
    this.importData = importData;
  }
}
