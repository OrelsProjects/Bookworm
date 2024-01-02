import React, { useEffect, useRef, useState } from "react";
import EmptyTable from "./emptyTable";
import useTable from "../../hooks/useTable";
import TableHeader from "./tableHeader";
import BookItem from "./tableItem";

export enum TableType {
  READ = 1, // Numbers in backend
  TO_READ = 2,
}

export type BooksTableProps = {
  type: TableType;
};

const BooksTable: React.FC<BooksTableProps> = ({ type }) => {
  const {
    userBooks,
    loading,
    error,
    currentPage,
    pageSize,
    totalRecords,
    handlePageChange,
    handlePageSizeChange,
    updateTableType,
  } = useTable({ initialType: type });

  const headerRef = useRef(null); // Reference to the header element
  const [tableHeight, setTableHeight] = useState(0); // State to store the calculated height

  useEffect(() => {
    updateTableType(type);
  }, [type]);

  useEffect(() => {
    // Function to calculate the available height for the table
    const calculateTableHeight = () => {
      const headerHeight = (headerRef.current as any)?.offsetHeight || 0;
      const availableHeight = window.innerHeight - headerHeight - 224;
      setTableHeight(availableHeight);
    };

    // Calculate the height on first render
    calculateTableHeight();

    // Add event listener to recalculate on window resize
    window.addEventListener("resize", calculateTableHeight);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", calculateTableHeight);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  if (!userBooks) {
    return <EmptyTable />;
  }
  return (
    <div className="flex flex-col w-full h-full">
      <div ref={headerRef}>
        <TableHeader />
      </div>
      <div
        className="flex flex-col overflow-y-auto gap-2 scrollbar-hide"
        style={{ height: tableHeight }}
      >
        {userBooks && userBooks.length > 0 ? (
          userBooks.map((bookData, index) => (
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
