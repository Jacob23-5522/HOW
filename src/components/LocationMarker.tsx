import React, { useState, useEffect, useCallback } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

const LocationMarker = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  const handleLocate = useCallback(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 14);
    });
  }, [map]);

  useEffect(() => {
    handleLocate();
  }, [handleLocate]);

  return (
    <>
      {position && (
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLocate();
          }}
          className="p-3 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
          title="Locate Me"
        >
          <MapPin className="w-6 h-6 text-health-green group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </>
  );
};

export default LocationMarker;
