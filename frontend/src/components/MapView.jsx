
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

function MapUpdater({ pickupLocation, destination, routeInfo }) {
  const map = useMap();

  useEffect(() => {
    if (routeInfo?.geometry?.coordinates?.length) {
      const routeCoordinates =
        routeInfo.geometry.coordinates.map(
          ([longitude, latitude]) => [latitude, longitude]
        );

      map.fitBounds(routeCoordinates, {
        padding: [50, 50],
      });
    } else if (destination) {
      map.flyTo(
        [destination.latitude, destination.longitude],
        15,
        { duration: 1.5 }
      );
    } else if (pickupLocation) {
      map.flyTo(
        [pickupLocation.latitude, pickupLocation.longitude],
        13
      );
    }
  }, [map, pickupLocation, destination, routeInfo]);

  return null;
}

function MapView({
  pickupLocation,
  destination,
  routeInfo,
}) {
  const center = [
    pickupLocation.latitude,
    pickupLocation.longitude,
  ];

  const routeCoordinates =
    routeInfo?.geometry?.coordinates?.map(
      ([longitude, latitude]) => [latitude, longitude]
    ) || [];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater
        pickupLocation={pickupLocation}
        destination={destination}
        routeInfo={routeInfo}
      />

      <Marker
        position={[
          pickupLocation.latitude,
          pickupLocation.longitude,
        ]}
      >
        <Popup>Pickup: {pickupLocation.name}</Popup>
      </Marker>

      {destination && (
        <Marker
          position={[
            destination.latitude,
            destination.longitude,
          ]}
        >
          <Popup>
            Destination: {destination.address}
          </Popup>
        </Marker>
      )}

      {routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: "#2563eb",
            weight: 6,
            opacity: 0.8,
          }}
        />
      )}
    </MapContainer>
  );
}

export default MapView;