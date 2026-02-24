"use client";
import { useEffect, useRef, useState } from "react";

export default function ApartmentMap({ apartments }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainer.current || typeof window === "undefined") return;

    // Import Leaflet only on client-side after mount
    const L = require("leaflet");
    require("leaflet/dist/leaflet.css");

    // Initialize map only once
    if (map.current) return;

    map.current = L.map(mapContainer.current).setView([41.6611, -91.5302], 15);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current);

    // Fix Leaflet icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, [isMounted]);

  // Add markers when apartments change
  useEffect(() => {
    if (!isMounted || !map.current) return;

    const L = require("leaflet");

    apartments.forEach((apt) => {
      if (apt.latitude && apt.longitude) {
        const popup = `
          <div style="font-size: 13px;">
            <strong style="display: block; margin-bottom: 6px;">${apt.name}</strong>
            <p style="margin: 4px 0; font-size: 12px;">📍 ${apt.address}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #0066cc; font-weight: 600;">
              💰 $${apt.rent_min} - $${apt.rent_max}/mo
            </p>
            <a href="/apartment/${apt.id}" style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #0066cc; color: white; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 500;">
              View details →
            </a>
          </div>
        `;
        L.marker([apt.latitude, apt.longitude])
          .bindPopup(popup)
          .addTo(map.current);
      }
    });
  }, [apartments, isMounted]);

  if (!isMounted) {
    return (
      <div
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "8px",
          background: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        Loading map...
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    />
  );
}


