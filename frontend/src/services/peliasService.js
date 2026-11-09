
const PELIAS_URL = "https://pelias.mapc.org/v1";

export const searchLocations = async (query, signal) => {
  const params = new URLSearchParams({
    text: query,
    size: "5",
  });

  const response = await fetch(
    `${PELIAS_URL}/autocomplete?${params}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Location search failed");
  }

  const data = await response.json();

  return (data.features || []).map((feature) => ({
    id: feature.properties.gid,
    name: feature.properties.name,
    address: feature.properties.label,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
  }));
};
