"use client";

import { useState } from "react";
import { useDebounce } from "@/lib/hooks";
import { SearchResults } from "./SearchResults";
import { LatestAndEditorsPick } from "./LatestAndEditorsPick";

type Props = {
  applications: IApplication[];
};

export const SearchBar: React.FC<Props> = ({ applications }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    items: IApplication[];
    show: boolean;
  }>({
    items: [],
    show: false,
  });

  const getLowerCaseCategories = (categories: string[]) => {
    return categories.map((category) => category.toLowerCase());
  };

  const search = () => {
    const items = query
      ? applications.filter((item) => {;
          return (
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            (getLowerCaseCategories(item.category).includes(
              query.toLowerCase()
            ) &&
              item)
          );
        })
      : [];

    setResults((prevResults) => ({ ...prevResults, items }));
  };

  useDebounce(search, query, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="flex flex-col mt-8 sm:-mx-2 sm:flex-row sm:justify-center w-full max-w-2xl">
        <div className="search-box flex items-center w-full sm:w-3/4 md:max-w-lg rounded-lg focus-within:shadow-lg bg-gray-100">
          <input
            className="bg-transparent border-0 h-full py-4 placeholder:opacity-60 w-full outline-none text-sm text-gray-700 pr-2 border-gray-300 rounded-l-lg"
            type="text"
            autoComplete="off"
            value={query}
            onChange={handleSearch}
            id="search"
            placeholder="Search for apps, tools, libraries..."
            onFocus={() => setResults({ ...results, show: true })}
            onBlur={() =>
              setTimeout(() => setResults({ ...results, show: false }), 150)
            }
          />

          <button className="grid w-12 h-full text-gray-300 place-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {results.show && (
        <div className="absolute w-full z-20 flex items-center max-w-2xl justify-center pt-4 mt-20">
          <ul className="relative w-full bg-white sm:w-3/4 rounded-lg focus-within:shadow-lg pb-4 shadow-md">
            {results.items.length > 0 ? (
              <SearchResults results={results} />
            ) : (
              <LatestAndEditorsPick data={applications} />
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
