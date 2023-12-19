class ReadingStatusDTO {
  reading_status_id: number;
  status_name: string;

  constructor(reading_status_id: number, status_name: string) {
    this.reading_status_id = reading_status_id;
    this.status_name = status_name;
  }
}

export default ReadingStatusDTO;
