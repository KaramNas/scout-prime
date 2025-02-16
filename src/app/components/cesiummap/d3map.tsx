'use client';
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// ✅ Dynamically Import Leaflet Components (Disable SSR)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });

const D3Map: React.FC = () => {
  const [geoData, setGeoData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // ✅ Define Lebanon’s bounding box (Southwest & Northeast corners)
  const lebanonBounds: [[number, number], [number, number]] = [
    [33.0, 35.0], // Southwest (bottom-left)
    [34.7, 37.0], // Northeast (top-right)
  ];

  useEffect(() => {
    fetch("/lebanon.geojson") // ✅ Ensure it's in `/public` folder
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  // ✅ Handle Region Click
  const onRegionClick = (event: any, feature: any) => {
    setSelectedRegion(feature.properties.NAME_3 || feature.properties.NAME || "Unknown Region");
  };

  return (
    <div className="flex h-screen">
      {/* ✅ Map Section */}
      <div className="w-3/4 h-full">
        <MapContainer 
          center={[33.8547, 35.8623]} // ✅ Lebanon’s center
          zoom={8}
          className="h-full w-full"
          maxBounds={lebanonBounds} // ✅ Restrict map to Lebanon
          maxBoundsViscosity={1.0} // ✅ Prevents moving outside bounds
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {geoData && (
            <GeoJSON
              data={geoData}
              style={{ color: "#2563eb", weight: 1.5, fillOpacity: 0.4 }}
              onEachFeature={(feature, layer) => {
                layer.on("click", (event) => onRegionClick(event, feature));
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* ✅ Sidebar Section */}
      <div className="w-1/4 bg-gray-100 p-4 flex flex-col justify-center">
        {selectedRegion ? (
          <div>
            <h2 className="text-2xl font-bold text-blue-600">{selectedRegion}</h2>
            <p className="mt-2 text-gray-700">Show relevant research data here...</p>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Click a region to see details.</p>
        )}
      </div>
    </div>
  );
};

export default D3Map;
