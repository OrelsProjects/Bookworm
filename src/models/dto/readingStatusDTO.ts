import ReadingStatus from "../readingStatus";
import { z } from "zod";

class ReadingStatusDTO {
  reading_status_id: number;
  status_name: string;

  constructor(reading_status_id: number, status_name: string) {
    this.reading_status_id = reading_status_id;
    this.status_name = status_name;
  }

  static schema = z.object({
    reading_status_id: z.number(),
    status_name: z.string(),
  });

  static FromResponse(readingStatusDTO: ReadingStatusDTO) {
    return new ReadingStatus(
      readingStatusDTO.reading_status_id,
      readingStatusDTO.status_name
    );
  }
}

export default ReadingStatusDTO;
