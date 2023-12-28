import React from "react";
import EmptyTable from "./emptyTable";
import useTable from "../../hooks/useTable";
import TableHeader, { TableHeaderDirection } from "./tableHeader";
import BookItem from "./tableItem";

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
    <div className="w-full h-full mx-auto my-6">
      <TableHeader />
      <div className="flex flex-col gap-2">
        {userBooksData && userBooksData.length > 0 ? (
          userBooksData.map((bookData, index) => (
            <BookItem key={index} userBookData={bookData} />
          ))
        ) : (
          <EmptyTable />
        )}
      </div>
    </div>
  );
};

export default BooksTable;
