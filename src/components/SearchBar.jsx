import { useState } from "react";

function SearchBar({ onSearch, loading, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();

    const query = value.trim();

    if (!query || loading) {
      return;
    }

    onSearch(query);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="medicine-search" className="sr-only">
        Search medicine by brand name
      </label>

      <input
        id="medicine-search"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search by brand name..."
        autoComplete="off"
      />

      <button type="submit" disabled={loading || !value.trim()}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;