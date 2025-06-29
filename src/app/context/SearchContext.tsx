// src/context/SearchContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { getBooksBySearch } from "@/app/services/api/books";

type SearchContextType = {
  searchQuery: string;
  searchResults: any[];
  handleSearch: (query: string) => void;
    setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void; 
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const res = await getBooksBySearch(query);
    setSearchResults(res?.data?.data || []);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, searchResults, handleSearch,setSearchQuery,
        setSearchResults, }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearchContext must be used within a SearchProvider");
  return context;
};
