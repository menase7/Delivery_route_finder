
function formatDistance(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }

  return `${Math.round(meters)} m`;
}

function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60);

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours} hr ${remainingMinutes} min`;
  }

  return `${minutes} min`;
}

function DirectionsPanel({ routeInfo }) {
  if (!routeInfo) return null;

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-bold">
        Route Information
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-sm text-gray-500">
            Total Distance
          </p>

          <p className="text-xl font-bold text-blue-600">
            {formatDistance(routeInfo.distance)}
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-3">
          <p className="text-sm text-gray-500">
            Estimated Duration
          </p>

          <p className="text-xl font-bold text-green-600">
            {formatDuration(routeInfo.duration)}
          </p>
        </div>
      </div>

      <h3 className="mb-3 mt-5 font-semibold">
        Directions
      </h3>

      <div className="max-h-64 space-y-3 overflow-y-auto">
        {routeInfo.steps.map((step, index) => {
          const maneuver = step.maneuver;

          const instruction = [
            maneuver.type,
            maneuver.modifier,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={index}
              className="flex gap-3 border-b pb-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                {index + 1}
              </div>

              <div>
                <p className="font-medium capitalize">
                  {instruction}
                  {step.name ? ` onto ${step.name}` : ""}
                </p>

                <p className="text-sm text-gray-500">
                  {formatDistance(step.distance)}
                  {" · "}
                  {formatDuration(step.duration)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DirectionsPanel;