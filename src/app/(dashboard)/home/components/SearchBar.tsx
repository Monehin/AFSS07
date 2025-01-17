// components/SearchBar.tsx
"use client";

import React, { ChangeEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search members..."
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>
  );
};

export default SearchBar;
