
import { useState } from "react";
import MapView from "./components/MapView";
import LocationSearch from "./components/LocationSearch";

const pickupLocation = {
  name: "Times Square, New York",
  latitude: 40.7580,
  longitude: -73.9855,
};

function App() {
  const [destination, setDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDestinationSelect = (location) => {
    setDestination(location);
    setRouteInfo(null);
    setError("");
  };

  const calculateRoute = async () => {
    if (!destination) {
      setError("Please select a destination first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const coordinates = [
        `${pickupLocation.longitude},${pickupLocation.latitude}`,
        `${destination.longitude},${destination.latitude}`,
      ].join(";");

      const url =
        `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
        `?overview=full&geometries=geojson`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== "Ok" || !data.routes?.length) {
        throw new Error("No route found.");
      }

      const route = data.routes[0];

      setRouteInfo({
        geometry: route.geometry,
        distanceKm: route.distance / 1000,
        durationMinutes: route.duration / 60,
      });
    } catch (err) {
      setError(err.message || "Failed to calculate route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="bg-white p-4 shadow">
        <h1 className="text-2xl font-bold text-blue-600">
          Mini Delivery Route Finder
        </h1>

        <div className="mt-4">
          <LocationSearch
            onSelectLocation={handleDestinationSelect}
          />
        </div>

        <button
          onClick={calculateRoute}
          disabled={!destination || loading}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
        >
          {loading ? "Calculating..." : "Calculate Route"}
        </button>

        {error && (
          <p className="mt-2 text-red-500">{error}</p>
        )}

        {routeInfo && (
          <div className="mt-3 rounded-lg bg-blue-50 p-3">
            <p>
              Distance: {routeInfo.distanceKm.toFixed(2)} km
            </p>

            <p>
              Estimated time:{" "}
              {Math.round(routeInfo.durationMinutes)} minutes
            </p>
          </div>
        )}
      </header>

      <main className="flex-1 p-4">
        <div className="h-full overflow-hidden rounded-xl shadow">
          <MapView
            pickupLocation={pickupLocation}
            destination={destination}
            routeInfo={routeInfo}
          />
        </div>
      </main>
    </div>
  );
}

export default App;