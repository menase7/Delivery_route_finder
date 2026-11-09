import MapView from "./components/MapView";

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-blue-600">
          Mini Delivery Route Finder
        </h1>

        <p className="text-gray-500">
          Find locations and calculate delivery routes
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="h-full overflow-hidden rounded-xl shadow">
          <MapView />
        </div>
      </main>
    </div>
  );
}

export default App;
