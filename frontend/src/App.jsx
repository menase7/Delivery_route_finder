
import { useState } from "react";

import MapView from "./components/MapView";
import LocationSearch from "./components/LocationSearch";

function App() {
  const [selectedLocation, setSelectedLocation] =
    useState(null);

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="bg-white p-4 shadow">
        <h1 className="text-2xl font-bold text-blue-600">
          Mini Delivery Route Finder
        </h1>

        <p className="text-gray-500">
          Search and find delivery destinations
        </p>

        <div className="mt-4">
          <LocationSearch
            onSelectLocation={setSelectedLocation}
          />
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="h-full overflow-hidden rounded-xl shadow">
          <MapView selectedLocation={selectedLocation} />
        </div>
      </main>
    </div>
  );
}

export default App;