import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MedicineCard from "../components/MedicineCard";
import { searchMedicines } from "../api";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(urlQuery);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(Boolean(urlQuery));

  const requestRef = useRef(null);

  async function runSearch(searchTerm) {
    const cleanQuery = searchTerm.trim();

    if (!cleanQuery) {
      return;
    }

    if (requestRef.current) {
      requestRef.current.abort();
    }

    const controller = new AbortController();
    requestRef.current = controller;

    setQuery(cleanQuery);
    setLoading(true);
    setError("");
    setHasSearched(true);

    setSearchParams({ q: cleanQuery });

    try {
      const results = await searchMedicines(
        cleanQuery,
        controller.signal
      );

      if (!controller.signal.aborted) {
        setMedicines(results);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }

      setMedicines([]);
      setError(
        err.message || "Unable to fetch medicines. Please try again."
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (!urlQuery) {
      return undefined;
    }

    runSearch(urlQuery);

    return () => {
      if (requestRef.current) {
        requestRef.current.abort();
      }
    };
  }, []);

  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">FDA DRUG LABEL SEARCH</p>

        <h1>Medicine Search</h1>

        <p className="subtitle">
          Search medicine information by brand name.
        </p>

        <SearchBar
          onSearch={runSearch}
          loading={loading}
          initialValue={urlQuery}
        />
      </section>

      {loading && (
        <div className="status" role="status">
          <div className="loader" />
          <h2>Searching...</h2>
          <p>Fetching medicine information.</p>
        </div>
      )}

      {!loading && error && (
        <div className="status error" role="alert">
          <h2>Unable to load results</h2>

          <p>{error}</p>

          <button
            type="button"
            className="retry-button"
            onClick={() => runSearch(query)}
          >
            Try again
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        hasSearched &&
        medicines.length === 0 && (
          <div className="status">
            <h2>No results found</h2>

            <p>
              No medicines were found for "{query}". Try another
              brand name.
            </p>
          </div>
        )}

      {!loading && !error && medicines.length > 0 && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <p className="eyebrow">RESULTS</p>
              <h2>Medicines</h2>
            </div>

            <span>{medicines.length} found</span>
          </div>

          <div className="medicine-grid">
            {medicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                query={query}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default SearchPage;