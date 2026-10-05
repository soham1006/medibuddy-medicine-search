const API_BASE = "https://api.fda.gov/drug/label.json";

const searchCache = new Map();

export async function searchMedicines(query, signal) {
  const normalizedQuery = query.trim().toLowerCase();

  if (searchCache.has(normalizedQuery)) {
    return searchCache.get(normalizedQuery);
  }

  const params = new URLSearchParams({
    search: `openfda.brand_name:"${normalizedQuery}"`,
    limit: "20",
  });

  const response = await fetch(`${API_BASE}?${params.toString()}`, {
    signal,
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("Unable to fetch medicines. Please try again.");
  }

  const data = await response.json();
  const results = Array.isArray(data.results) ? data.results : [];

  searchCache.set(normalizedQuery, results);

  return results;
}

export async function getMedicine(id, signal) {
  const params = new URLSearchParams({
    search: `id:"${id}"`,
    limit: "1",
  });

  const response = await fetch(`${API_BASE}?${params.toString()}`, {
    signal,
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load medicine details.");
  }

  const data = await response.json();

  return data.results?.[0] || null;
}