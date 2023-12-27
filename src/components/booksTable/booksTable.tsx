import React from "react";
import EmptyTable from "./emptyTable";
import useTable from "../../hooks/useTable";
import TableHeader, {
  TableHeaderDirection,
  TableHeaderItem,
} from "./tableHeader";
import BookItem from "./tableItem";

const headers: TableHeaderItem[] = [
  {
    label: "Title",
    canSort: true,
    direction: TableHeaderDirection.NONE,
  },
  {
    label: "Author",
    canSort: true,
    direction: TableHeaderDirection.NONE,
  },
  {
    label: "Pages#",
    canSort: true,
    groupId: "basic_details",
    direction: TableHeaderDirection.NONE,
  },
  {
    label: "Genre",
    canSort: true,
    groupId: "basic_details",
    direction: TableHeaderDirection.NONE,
  },
  {
    label: "Publish Year",
    canSort: true,
    groupId: "basic_details",
    direction: TableHeaderDirection.NONE,
  },
  {
    label: "Rating",
    canSort: true,
    direction: TableHeaderDirection.NONE,
  },
];

const BooksTable: React.FC = () => {
  const {
    userBooksData,
    loading,
    error,
    currentPage,
    pageSize,
    totalRecords,
    handlePageChange,
    handlePageSizeChange,
  } = useTable();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  if (!userBooksData) {
    return <EmptyTable />;
  }
  return (
    <div className="container mx-auto my-4">
      <TableHeader items={headers} />
      {userBooksData && userBooksData.length > 0 ? (
        userBooksData.map((bookData, index) => <BookItem key={index} userBookData={bookData} />)
      ) : (
        <EmptyTable />
      )}
    </div>
  );
};

export default BooksTable;
