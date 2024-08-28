import React, { useEffect, useRef, useState } from "react";
import { WaypointProps } from "../../models";
import "./map.scss";
import mapboxgl from "mapbox-gl";

import { MAPBOX_TOKEN } from "../../configs/config";
import { log } from "console";

mapboxgl.accessToken = MAPBOX_TOKEN;

const Map = ({ route }: { route: WaypointProps | null }) => {
  const mapContainer = useRef(null);
  const map = useRef(null) as React.MutableRefObject<mapboxgl.Map | null>;
  const [zoom, setZoom] = useState<number>(9);
  const [lng, setLng] = useState<number>(-70.9);
  const [lat, setLat] = useState<number>(42.35);

  useEffect(() => {
    if (map.current !== null) return;
    if (mapContainer.current === null) return;
    console.log("test");

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      if (map.current === null) return;
      const center = map.current.getCenter();
      setLng(Number(center.lng.toFixed(4)));
      setLat(Number(center.lat.toFixed(4)));
      setZoom(Number(map.current.getZoom().toFixed(2)));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(zoom, lng, lat);

  return (
    <section className="map">
      <div ref={mapContainer} className="map-container" />
    </section>
  );
};

export default Map;
