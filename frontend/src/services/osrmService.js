
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

export const getDirections = async (pickup, destination) => {
  const coordinates = [
    `${pickup.longitude},${pickup.latitude}`,
    `${destination.longitude},${destination.latitude}`,
  ].join(";");

  const params = new URLSearchParams({
    overview: "full",
    geometries: "geojson",
    steps: "true",
  });

  const response = await fetch(
    `${OSRM_URL}/${coordinates}?${params}`
  );

  if (!response.ok) {
    throw new Error("OSRM request failed");
  }

  const data = await response.json();

  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error("No driving route found");
  }

  const route = data.routes[0];

  return {
    geometry: route.geometry,

    distance: route.distance,
    duration: route.duration,

    distanceKm: route.distance / 1000,
    durationMinutes: route.duration / 60,

    steps: route.legs.flatMap((leg) => leg.steps),
  };
};
