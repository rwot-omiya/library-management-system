import { useEffect, useState } from 'react';

function SearchBar({ value, onSearch }) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(inputValue);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [inputValue, onSearch]);

  return (
    <label className="search-field">
      <span className="sr-only">Search by title or author</span>
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Search by title or author..."
      />
      {inputValue && (
        <button className="clear-search" type="button" onClick={() => setInputValue('')} aria-label="Clear search">
          ×
        </button>
      )}
    </label>
  );
}

export default SearchBar;
