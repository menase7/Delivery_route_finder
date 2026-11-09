
import { useEffect, useState } from "react";
import { searchLocations } from "../services/peliasService";

function LocationSearch({
  label,
  placeholder,
  selectedLocation,
  onSelectLocation,
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (selected || query.trim().length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const results = await searchLocations(
          query,
          controller.signal
        );

        setSuggestions(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to search locations.");
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, selected]);

  const handleSelect = (location) => {
    setSelected(true);
    setQuery(location.address);
    setSuggestions([]);
    onSelectLocation(location);
  };

  const handleChange = (value) => {
    setQuery(value);
    setSelected(false);
    setSuggestions([]);

    if (selectedLocation) {
      onSelectLocation(null);
    }
  };

  return (
    <div className="relative w-full">
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-blue-500"
      />

      {loading && (
        <p className="mt-1 text-sm text-gray-500">
          Searching...
        </p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {suggestions.length > 0 && (
        <ul className="absolute z-[1100] mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-xl">
          {suggestions.map((location, index) => (
            <li
              key={location.id || index}
              onClick={() => handleSelect(location)}
              className="cursor-pointer border-b p-3 hover:bg-blue-50"
            >
              <p className="font-medium">
                {location.name}
              </p>

              <p className="text-sm text-gray-500">
                {location.address}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationSearch;