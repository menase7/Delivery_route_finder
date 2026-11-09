
import { useState } from "react";

const PELIAS_URL = "https://pelias.mapc.org/v1";

function LocationSearch({ onSelectLocation }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLocations = async (value) => {
    setQuery(value);

    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams({
        text: value,
        size: "5",
      });

      const response = await fetch(
        `${PELIAS_URL}/autocomplete?${params}`
      );

      if (!response.ok) {
        throw new Error("Failed to search locations");
      }

      const data = await response.json();

      setSuggestions(data.features || []);
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (feature) => {
    if (!feature?.geometry?.coordinates) return;

    const location = {
      name: feature.properties?.name || "",
      address: feature.properties?.label || feature.properties?.name || "",
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
    };

    onSelectLocation(location);

    setQuery(location.address);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => searchLocations(e.target.value)}
        placeholder="Search a destination..."
        className="w-full rounded-lg border bg-white p-3 shadow"
      />

      {loading && (
        <p className="p-2 text-sm text-gray-500">
          Searching...
        </p>
      )}

      {suggestions.length > 0 && (
        <ul className="absolute z-[1000] mt-1 w-full rounded-lg bg-white shadow-lg">
          {suggestions.map((feature) => (
            <li
              key={feature.properties.gid}
              onClick={() => handleSelect(feature)}
              className="cursor-pointer border-b p-3 hover:bg-gray-100"
            >
              <p className="font-medium">
                {feature.properties.name}
              </p>

              <p className="text-sm text-gray-500">
                {feature.properties.label}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationSearch;