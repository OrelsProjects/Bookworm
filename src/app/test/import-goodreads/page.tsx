"use client";
import React, { useState } from "react";

const GoodreadsImporter = () => {
  const [goodreadsUrl, setGoodreadsUrl] = useState("");

  const handleInputChange = (event) => {
    setGoodreadsUrl(event.target.value);
  };

  const handleImportClick = () => {
    console.log("Importing data from:", goodreadsUrl);
    // Add your import logic here
  };

  return (
    <div
      className="importer-container"
      style={{ padding: "20px", textAlign: "center" }}
    >
      <input
        type="text"
        placeholder="Goodreads Profile URL"
        value={goodreadsUrl}
        onChange={handleInputChange}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleImportClick} style={{ cursor: "pointer" }}>
        Import
      </button>
    </div>
  );
};

export default GoodreadsImporter;
