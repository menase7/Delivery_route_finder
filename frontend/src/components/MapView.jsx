
import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function MapUpdater({ pickup, destination, routeInfo }) {
  const map = useMap();

  useEffect(() => {
    if (routeInfo?.geometry?.coordinates?.length) {
      const positions = routeInfo.geometry.coordinates.map(
        ([longitude, latitude]) => [latitude, longitude]
      );

      map.fitBounds(positions, {
        padding: [50, 50],
      });
    } else if (pickup && destination) {
      map.fitBounds(
        [
          [pickup.latitude, pickup.longitude],
          [destination.latitude, destination.longitude],
        ],
        { padding: [50, 50] }
      );
    } else if (pickup) {
      map.flyTo([pickup.latitude, pickup.longitude], 14);
    } else if (destination) {
      map.flyTo(
        [destination.latitude, destination.longitude],
        14
      );
    }
  }, [map, pickup, destination, routeInfo]);

  return null;
}

function MapView({ pickup, destination, routeInfo }) {
  const center = [40.758, -73.9855];

  const routeCoordinates =
    routeInfo?.geometry?.coordinates?.map(
      ([longitude, latitude]) => [latitude, longitude]
    ) || [];

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater
        pickup={pickup}
        destination={destination}
        routeInfo={routeInfo}
      />

      {pickup && (
        <Marker position={[pickup.latitude, pickup.longitude]}>
          <Popup>
            Starting point: {pickup.name}
          </Popup>
        </Marker>
      )}

      {destination && (
        <Marker
          position={[
            destination.latitude,
            destination.longitude,
          ]}
        >
          <Popup>
            Destination: {destination.name}
          </Popup>
        </Marker>
      )}

      {routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: "#2563eb",
            weight: 6,
            opacity: 0.85,
          }}
        />
      )}
    </MapContainer>
  );
}

export default MapView;