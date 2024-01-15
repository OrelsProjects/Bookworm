import React, { useEffect, useRef, useState } from "react";
import EmptyTable from "./emptyTable";
import useTable from "../../hooks/useTable";
import TableHeader from "./tableHeader";
import TableItem from "./tableItem";
import ToggleButtons from "../toggleButtons";
import { SearchBarComponent } from "../search/searchBarComponent";
import Loading from "../loading";
import { OpacityDiv } from "../animationDivs";
import { EventTracker, TimeoutLength } from "@/src/eventTracker";

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
  const [searchValue, setSearchValue] = useState("");

  // Event tracking
  const [previousTimeout, setPreviousTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

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

  useEffect(() => {
    if (searchValue === "") {
      // First init of page or clear search
      return;
    }
    if (previousTimeout) {
      clearTimeout(previousTimeout);
    }
    setPreviousTimeout(
      setTimeout(() => {
        EventTracker.track(
          "User searched books in table",
          { searchValue: searchValue },
          TimeoutLength.LONG
        );
      }, 5000)
    ); // let the user type for 5 seconds before tracking
  }, [searchValue]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loading spinnerClassName="!w-24 !h-24 mb-48 !fill-primary" />
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
    <OpacityDiv className="flex flex-col w-full h-full">
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
    </OpacityDiv>
  );
};

export default BooksTable;
