import ReadingStatus from "../readingStatus";
import { ReadingStatusDTO } from "../dto";

export function convertToReadingStatus(
  readingStatusDTO: ReadingStatusDTO
): ReadingStatus {
  return new ReadingStatus(
    readingStatusDTO.reading_status_id,
    readingStatusDTO.status_name
  );
}

export function convertToReadingStatusDTO(
  readingStatus: ReadingStatus
): ReadingStatusDTO {
  return new ReadingStatusDTO(
    readingStatus.readingStatusId,
    readingStatus.statusName
  );
}
