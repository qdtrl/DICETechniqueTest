import React, { useContext, useEffect, useRef } from "react";
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

  const { routes } = useContext(RoutesContext) as any;
  const { setPoint } = useContext(PointContext);

  useEffect(() => {
    if (map.current !== null) return;
    if (mapContainer.current === null) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [3.5, 48],
      zoom: 5,
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
      routes.forEach((route: RouteProps) => {
        if (map.current === null) return;
        map.current.addSource(route.id, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route.points.map((point: WaypointProps) => [
                point.lng,
                point.lat,
              ]),
            },
          },
        });

        map.current.addSource(route.id + "-point", {
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

        if (route.show) {
          map.current.addLayer({
            id: route.id,
            type: "line",
            source: route.id,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#0070fe",
              "line-width": 4,
            },
          });

          map.current.addLayer({
            id: route.id + "-point",
            type: "circle",
            source: route.id + "-point",
            paint: {
              "circle-radius": 10,
              "circle-color": "#0070fe",
            },
          });
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map.current === null || !map.current?.isStyleLoaded()) return;
    routes.forEach((route: RouteProps) => {
      if (map.current === null) return;
      if (map.current.isSourceLoaded(route.id)) {
        if (
          map.current?.getSource(route.id + "-point") &&
          (map.current.getSource(route.id + "-point") as any).setData
        ) {
          (map.current.getSource(route.id + "-point") as any).setData({
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
          });
        }
        if (
          map.current?.getSource(route.id) &&
          (map.current.getSource(route.id) as any).setData
        ) {
          (map.current.getSource(route.id) as any).setData({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route.points.map((point: WaypointProps) => [
                point.lng,
                point.lat,
              ]),
            },
          });
        }
      } else {
        map.current.addSource(route.id, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route.points.map((point: WaypointProps) => [
                point.lng,
                point.lat,
              ]),
            },
          },
        });

        map.current.addSource(route.id + "-point", {
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
      }

      if (route.show) {
        if (!map.current.getLayer(route.id)) {
          map.current.addLayer({
            id: route.id,
            type: "line",
            source: route.id,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#0070fe",
              "line-width": 4,
            },
          });
        }
        if (!map.current.getLayer(route.id + "-point")) {
          map.current.addLayer({
            id: route.id + "-point",
            type: "circle",
            source: route.id + "-point",
            paint: {
              "circle-radius": 10,
              "circle-color": "#0070fe",
            },
          });
        }
      } else {
        if (map.current.getLayer(route.id)) {
          map.current.removeLayer(route.id);
        }
        if (map.current.getLayer(route.id + "-point")) {
          map.current.removeLayer(route.id + "-point");
        }
      }
    });
  }, [routes]);

  return (
    <section className="map">
      <div ref={mapContainer} className="map-container" />
    </section>
  );
};

export default Map;
