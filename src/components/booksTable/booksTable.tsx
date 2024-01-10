import React, { useEffect, useRef, useState } from "react";
import EmptyTable from "./emptyTable";
import useTable from "../../hooks/useTable";
import TableHeader from "./tableHeader";
import TableItem from "./tableItem";
import ToggleButtons from "../toggleButtons";
import { SearchBarComponent } from "../search/searchBarComponent";
import Loading from "../loading";
import useBook from "@/src/hooks/useBook";

export enum TableType {
  READ = 1, // Numbers in backend
  TO_READ = 2,
}

const BooksTable: React.FC = () => {
  const { userBooks, loading, error, updateTableType, searchBooks } = useTable({
    initialType: TableType.TO_READ,
  });

  const { loadUserBooks } = useBook();

  const headerRef = useRef(null); // Reference to the header element
  const [tableHeight, setTableHeight] = useState(0); // State to store the calculated height
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    // Function to calculate the available height for the table
    const calculateTableHeight = () => {
      const headerHeight = (headerRef.current as any)?.offsetHeight || 0;
      const availableHeight = window.innerHeight - headerHeight - 250;
      setTableHeight(availableHeight);
    };
    calculateTableHeight();
    window.addEventListener("resize", calculateTableHeight);

    return () => window.removeEventListener("resize", calculateTableHeight);
  }, []);

  useEffect(() => {
    searchBooks(searchValue);
  }, [searchValue]);

  if (loading) {
    return (
      <div className="w-full h-full justify-center items-center">
        <Loading className="!w-12 !h-12" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  if (!userBooks) {
    return <EmptyTable />;
  }

  const onSearch = (value: string) => {
    setSearchValue(value);
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
            <TableItem key={index} userBookData={bookData} />
          ))
        ) : (
          <div className="h-full w-full flex flex-col justify-center items-center">
            <EmptyTable isSearch={searchValue !== ""} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksTable;
