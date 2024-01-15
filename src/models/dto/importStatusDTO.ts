import { ImportStatusType } from "../importStatus";

export class ImportDataDTO {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  status: ImportStatusType;
  is_deleted: boolean;

  constructor(
    id: string,
    user_id: string,
    start_time: string,
    status: ImportStatusType,
    is_deleted: boolean,
    end_time?: string
  ) {
    this.id = id;
    this.user_id = user_id;
    this.start_time = start_time;
    this.end_time = end_time;
    this.status = status;
    this.is_deleted = is_deleted;
  }
}

export class ImportStatusDTO {
  import_data: ImportDataDTO;

  constructor(importData: ImportDataDTO) {
    this.import_data = importData;
  }
}
