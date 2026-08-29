"use client";

import { useEffect, useRef } from "react";
import type * as Leaflet from "leaflet";

import { formatLocation } from "@/lib";

import { useTracker } from "./TrackerProvider";

const TILES =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
const PIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 56" width="46" height="56" fill="currentColor" class="text-black"><path fill-rule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/></svg>`;
const ZOOM = 13;

function centreBelowCard(
  L: typeof Leaflet,
  node: HTMLElement,
  lat: number,
  lng: number,
) {
  const card = node.parentElement?.querySelector("section");
  const overlap = card
    ? Math.max(
        0,
        card.getBoundingClientRect().bottom - node.getBoundingClientRect().top,
      )
    : 0;
  const crs = L.CRS.EPSG3857;
  const shifted = crs
    .latLngToPoint(L.latLng(lat, lng), ZOOM)
    .subtract(L.point(0, overlap / 2));
  return crs.pointToLatLng(shifted, ZOOM);
}

export default function MapPanel() {
  const { result } = useTracker();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const marker = useRef<Leaflet.Marker | null>(null);

  const lat = result?.lat;
  const lng = result?.lng;

  useEffect(() => {
    if (lat === undefined || lng === undefined) return;
    let cancelled = false;

    void (async () => {
      const [L] = await Promise.all([
        import("leaflet"),
        import("leaflet/dist/leaflet.css"),
      ]);
      const node = container.current;
      if (cancelled || !node) return;

      const centre = centreBelowCard(L, node, lat, lng);

      if (!map.current) {
        map.current = L.map(node, { zoomControl: false }).setView(centre, ZOOM);
        map.current.attributionControl.setPrefix(false);
        L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 20 }).addTo(
          map.current,
        );
        L.control.zoom({ position: "bottomright" }).addTo(map.current);
        marker.current = L.marker([lat, lng], {
          icon: L.divIcon({
            html: PIN,
            className: "",
            iconSize: [46, 56],
            iconAnchor: [23, 56],
          }),
          interactive: false,
          keyboard: false,
        }).addTo(map.current);
        return;
      }

      marker.current?.setLatLng([lat, lng]);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        map.current.setView(centre, ZOOM, { animate: false });
      } else {
        map.current.flyTo(centre, ZOOM, { duration: 1.2 });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  useEffect(
    () => () => {
      map.current?.remove();
      map.current = null;
    },
    [],
  );

  return (
    <div
      ref={container}
      role="application"
      aria-label={
        result ? `Map centred on ${formatLocation(result)}` : "Location map"
      }
      className="v-map absolute inset-0 z-0 bg-divider"
    />
  );
}
