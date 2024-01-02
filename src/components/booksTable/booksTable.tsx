import React, { useEffect, useRef, useState } from "react";
import EmptyTable from "./emptyTable";
import useTable from "../../hooks/useTable";
import TableHeader from "./tableHeader";
import BookItem from "./tableItem";
import ToggleButtons from "../toggleButtons";
import { SearchBarComponent } from "../search/searchBarComponent";

export enum TableType {
  READ = 1, // Numbers in backend
  TO_READ = 2,
}

const BooksTable: React.FC = () => {
  const { userBooks, loading, error, updateTableType, searchBooks } = useTable({
    initialType: TableType.TO_READ,
  });

  const headerRef = useRef(null); // Reference to the header element
  const [tableHeight, setTableHeight] = useState(0); // State to store the calculated height

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

  const onSearch = (value: string) => {
    searchBooks(value);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex flex-row justify-between items-center mb-8">
        <ToggleButtons
          values={[
            { type: TableType.TO_READ, label: "To Read" },
            { type: TableType.READ, label: "Books I've Read" },
          ]}
          onToggle={(type: TableType) => updateTableType(type)}
          className="h-12"
        />
        <div>
          <SearchBarComponent
            onSubmit={onSearch}
            onChange={onSearch}
            className="rounded-full"
          />
        </div>
      </div>
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
