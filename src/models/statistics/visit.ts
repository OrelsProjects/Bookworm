export interface ListVisit {
  listId: string;
  visitedAt: Date;
}

export interface BookVisit {
  bookId: number;
  visitedAt: Date;
}

export interface BookInListVisit {
  listId: string;
  bookId: number;
  visitedAt: Date;
}
