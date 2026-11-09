
import { useState } from "react";

import LocationSearch from "./components/LocationSearch";
import MapView from "./components/MapView";
import DirectionsPanel from "./components/DirectionsPanel";

import { getDirections } from "./services/osrmService";

function App() {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);

  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePickupSelect = (location) => {
    setPickup(location);
    setRouteInfo(null);
    setError("");
  };

  const handleDestinationSelect = (location) => {
    setDestination(location);
    setRouteInfo(null);
    setError("");
  };

  const handleGetDirections = async () => {
    if (!pickup || !destination) {
      setError("Please select both locations.");
      return;
    }

    if (
      pickup.latitude === destination.latitude &&
      pickup.longitude === destination.longitude
    ) {
      setError("Starting point and destination must be different.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRouteInfo(null);

      const result = await getDirections(pickup, destination);

      setRouteInfo(result);
    } catch (err) {
      setError(err.message || "Unable to calculate directions.");
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

        <p className="text-sm text-gray-500">
          Find directions between two locations.
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col md:flex-row">

        {/* Directions Sidebar */}
        <aside className="z-10 w-full space-y-4 overflow-y-auto bg-gray-50 p-4 md:w-[400px] md:shrink-0">

          <LocationSearch
            label="Starting Location"
            placeholder="Search starting location..."
            selectedLocation={pickup}
            onSelectLocation={handlePickupSelect}
          />

          <LocationSearch
            label="Destination"
            placeholder="Search destination..."
            selectedLocation={destination}
            onSelectLocation={handleDestinationSelect}
          />

          <button
            onClick={handleGetDirections}
            disabled={!pickup || !destination || loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Calculating Route..." : "Get Directions"}
          </button>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <DirectionsPanel routeInfo={routeInfo} />

        </aside>

        {/* Map */}
        <section className="min-h-[400px] flex-1">
          <MapView
            pickup={pickup}
            destination={destination}
            routeInfo={routeInfo}
          />
        </section>

      </main>
    </div>
  );
}

export default App;