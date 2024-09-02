import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteProps, WaypointProps } from "../../models";
import "./create.scss";
import { Delete, Edit } from "@mui/icons-material";
import { generateRandomId } from "../../functions";
import { WaypointContext, RoutesContext } from "../../contexts";

const RouteCreate = () => {
  const navigate = useNavigate();

  const { routes, setRoutes } = useContext(RoutesContext) as any;
  const { point, setPoint } = useContext(WaypointContext);

  const [newRoute, setNewRoute] = useState<RouteProps>({
    id: generateRandomId(),
    show: true,
    name: "",
    startDate: "",
    points: [],
  });

  const [editWaypoint, setEditWaypoint] = useState<WaypointProps | null>(null);

  // Handle the state of routes with newRoute changes
  useEffect(() => {
    if (!routes.find((rte: RouteProps) => rte.id === newRoute.id)) {
      setRoutes([...routes, newRoute]);
    } else {
      setRoutes([
        ...routes.map((rte: RouteProps) =>
          rte.id === newRoute.id ? newRoute : rte
        ),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRoute]);

  // Handle the state of newRoute with routes changes
  useEffect(() => {
    const update = routes.find((rte: RouteProps) => rte.id === newRoute.id);
    if (!update) return;
    setNewRoute(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  // Add a new point to the route if a point is set on the map
  useEffect(() => {
    if (!point) return;
    setNewRoute({
      ...newRoute,
      points: [
        ...newRoute.points,
        { ...point, name: "WP " + (newRoute.points.length + 1) },
      ],
    });
    setPoint(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point]);

  const [newPoint, setNewPoint] = useState<WaypointProps>({
    id: generateRandomId(),
    name: "",
    lat: 0,
    lng: 0,
  });

  const handleAddRoute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate("/");
  };

  const handleAddPoint = () => {
    setNewRoute({
      ...newRoute,
      points: [...newRoute.points, newPoint],
    });
    setNewPoint({
      id: generateRandomId(),
      name: "",
      lat: 0,
      lng: 0,
    });
  };

  const handleRemoveWaypoint = (id: string) => () => {
    setNewRoute({
      ...newRoute,
      points: [...newRoute.points.filter((p: WaypointProps) => p.id !== id)],
    });
  };

  return (
    <div className="routes-container">
      <div className="routes-header">
        <div className="routes-header-left">
          <button
            onClick={() => {
              setRoutes([
                ...routes.filter((rte: RouteProps) => rte.id !== newRoute.id),
              ]);
              navigate("/");
            }}
          >
            {"<"}
          </button>
          <h1>Nouvelle route</h1>
        </div>
      </div>

      <form onSubmit={handleAddRoute} className="routes-form">
        <label>Nom de la route :</label>
        <input
          type="text"
          required
          placeholder="Routage 1"
          value={newRoute.name}
          onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
        />

        <label>Date de début :</label>
        <input
          type="date"
          required
          value={newRoute.startDate}
          onChange={(e) =>
            setNewRoute({ ...newRoute, startDate: e.target.value })
          }
        />

        <br />

        <label>Waypoints :</label>
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Nom</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th colSpan={2} />
            </tr>
          </thead>
          <tbody>
            {newRoute.points.map((point: WaypointProps) => (
              <tr key={point.id}>
                <td>{point.name}</td>
                <td style={{ textAlign: "right" }}>
                  {Boolean(editWaypoint?.id === point.id) ? (
                    <input
                      type="number"
                      style={{ width: "50px" }}
                      value={point.lat}
                      onChange={(e) =>
                        setNewRoute({
                          ...newRoute,
                          points: newRoute.points.map((p: WaypointProps) => {
                            if (p.id === point.id) {
                              return { ...p, lat: Number(e.target.value) };
                            }
                            return p;
                          }),
                        })
                      }
                    />
                  ) : (
                    point.lat
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  {Boolean(editWaypoint?.id === point.id) ? (
                    <input
                      type="number"
                      style={{ width: "50px" }}
                      value={point.lng}
                      onChange={(e) =>
                        setNewRoute({
                          ...newRoute,
                          points: newRoute.points.map((p: WaypointProps) => {
                            if (p.id === point.id) {
                              return { ...p, lng: Number(e.target.value) };
                            }
                            return p;
                          }),
                        })
                      }
                    />
                  ) : (
                    point.lng
                  )}
                </td>
                <td>
                  <button
                    style={{ width: "20px" }}
                    type="button"
                    onClick={() => setEditWaypoint(editWaypoint ? null : point)}
                  >
                    <Edit />
                  </button>
                </td>
                <td>
                  <button
                    style={{ width: "20px" }}
                    onClick={handleRemoveWaypoint(point.id)}
                  >
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <label style={{ marginTop: "2rem" }}>Nom du point :</label>
        <input
          type="text"
          placeholder="Nom"
          value={newPoint.name}
          onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
        />
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <label>Latitude :</label>
            <input
              style={{ width: "100px" }}
              max={90}
              min={-90}
              type="number"
              value={newPoint.lat}
              onChange={(e) =>
                setNewPoint({ ...newPoint, lat: Number(e.target.value) })
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <label>Longitude :</label>
            <input
              style={{ width: "100px" }}
              max={360}
              type="number"
              value={newPoint.lng}
              onChange={(e) =>
                setNewPoint({ ...newPoint, lng: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <button
          disabled={
            newPoint.name === "" || newPoint.lat === 0 || newPoint.lng === 0
          }
          style={{
            marginTop: "1rem",
            alignSelf: "flex-end",
            width: "fit-content",
          }}
          onClick={handleAddPoint}
        >
          Ajouter le point
        </button>

        <button
          style={{
            marginTop: "4rem",
            marginBottom: "4rem",
          }}
          disabled={newRoute.points.length === 0}
          type="submit"
        >
          Créer
        </button>
      </form>
    </div>
  );
};

export default RouteCreate;
