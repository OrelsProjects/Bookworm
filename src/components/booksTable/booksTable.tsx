import React, { useEffect } from "react";
import EmptyTable from "./emptyTable";
import useTable from "@/src/hooks/useTable";
import BooksHeader from "./header";
import BookItem from "./tableItem";

const BooksTable: React.FC = () => {
  const {
    data: books,
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
  if (!books) {
    return <EmptyTable />;
  }
  return (
    <div className="container mx-auto my-4">
      <BooksHeader />
      {books && books.length > 0 ? (
        books.map((bookData, index) => (
          <BookItem key={index} bookData={bookData} />
        ))
      ) : (
        <EmptyTable /> // This component is used when there are no books
      )}
    </div>
  );
};

export default BooksTable;
