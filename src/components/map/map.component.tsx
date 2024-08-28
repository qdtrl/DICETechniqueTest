import React, { useContext, useEffect, useRef, useState } from "react";
import "./map.scss";
import mapboxgl from "mapbox-gl";

import { MAPBOX_TOKEN } from "../../configs/config";
import { PointContext, RoutesContext } from "../../contexts";
import { RouteProps, WaypointProps } from "../../models";
import { generateRandomId } from "../../functions";

mapboxgl.accessToken = MAPBOX_TOKEN;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null) as React.MutableRefObject<mapboxgl.Map | null>;
  const [zoom, setZoom] = useState<number>(5);
  const [lng, setLng] = useState<number>(3.5);
  const [lat, setLat] = useState<number>(48);

  const { routes } = useContext(RoutesContext) as any;
  const { setPoint } = useContext(PointContext);

  useEffect(() => {
    if (map.current !== null) return;
    if (mapContainer.current === null) return;

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

    map.current.on("click", (e: mapboxgl.MapMouseEvent) => {
      if (map.current === null) return;
      const click = e.lngLat;
      setPoint({
        id: generateRandomId(),
        name: "",
        lat: click.lat.toFixed(4),
        lng: click.lng.toFixed(4),
      });
    });

    map.current.on("load", () => {
      if (map.current === null) return;
      map.current.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          if (error) throw error;
          if (map.current === null) return;
          if (!image) return;
          map.current.addImage("custom-marker", image);
        }
      );
      routes.forEach((route: RouteProps) => {
        if (map.current === null) return;
        map.current.addSource(route.id, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: route.points.map((point: WaypointProps) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [point.lng, point.lat],
              },
              properties: {
                title: point.name,
              },
            })),
          },
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="map">
      <div ref={mapContainer} className="map-container" />
    </section>
  );
};

export default Map;
