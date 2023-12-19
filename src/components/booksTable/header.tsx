import React from "react";

const BooksHeader: React.FC = () => {
  return (
    <div className="flex justify-between text-gray-600 uppercase tracking-wider bg-blue-900 p-4">
      <span>Book Name</span>
      <span>Author</span>
      <span>Pages# Genre PublishYear</span>
      <span>rating</span>
    </div>
  );
};

export default BooksHeader;
