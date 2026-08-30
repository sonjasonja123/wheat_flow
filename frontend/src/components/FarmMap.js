import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '430px' };
const defaultCenter = { lat: 44.0165, lng: 21.0059 };

const FarmMap = ({ locations = [], apiKey, selectedPosition, onSelect }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'wheat-flow-google-map',
    googleMapsApiKey: apiKey
  });

  if (loadError) return <div className="map-status error">Mapa nije dostupna. Proverite Google Maps API ključ.</div>;
  if (!isLoaded) return <div className="map-status">Učitavanje mape...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={selectedPosition || defaultCenter}
      zoom={selectedPosition ? 14 : 7}
      onClick={onSelect ? event => onSelect({
        lat: Number(event.latLng.lat().toFixed(7)),
        lng: Number(event.latLng.lng().toFixed(7))
      }) : undefined}
      options={{ streetViewControl: false, mapTypeControl: true, fullscreenControl: true }}
    >
      {locations.map(loc => (
        <Marker key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name} />
      ))}
      {selectedPosition && <Marker position={selectedPosition} title="Izabrana lokacija" label="✓" />}
    </GoogleMap>
  );
};

export default FarmMap;
