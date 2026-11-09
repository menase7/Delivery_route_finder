
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function MapUpdater({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.latitude != null && location?.longitude != null) {
      map.invalidateSize();
      map.setView(
        [location.latitude, location.longitude],
        15,
        { animate: true }
      );
    }
  }, [location, map]);

  return null;
}

const MapView = ({ selectedLocation }) => {
  const center = [9.03, 38.74];

  const markerPosition = selectedLocation
    ? [
        selectedLocation.latitude,
        selectedLocation.longitude,
      ]
    : center;

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater location={selectedLocation} />

      <Marker position={markerPosition}>
        <Popup>
          {selectedLocation
            ? selectedLocation.address
            : "Starting location"}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;