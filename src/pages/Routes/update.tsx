import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WaypointContext, RoutesContext } from "../../contexts";
import { generateRandomId } from "../../functions";
import { WaypointProps, RouteProps } from "../../models";
import { Delete, Edit } from "@mui/icons-material";

const RouteUpdate = () => {
  const navigate = useNavigate();
  const id = useParams().id;

  const { routes, setRoutes } = useContext(RoutesContext) as any;
  const { point, setPoint } = useContext(WaypointContext);
  const [editWaypoint, setEditWaypoint] = useState<WaypointProps | null>(null);

  const [updateRoute, setUpdateRoute] = useState<RouteProps>(
    routes.find((rte: RouteProps) => rte.id === id)
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [oldRoute, setOldRoute] = useState<RouteProps>(
    routes.find((rte: RouteProps) => rte.id === id)
  );

  const [newPoint, setNewPoint] = useState<WaypointProps>({
    id: generateRandomId(),
    name: "",
    lat: 0,
    lng: 0,
  });

  // Redirect to home if route is not found
  useEffect(() => {
    if (!updateRoute) {
      navigate("/");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle the state of routes with updateRoute changes
  useEffect(() => {
    setRoutes(
      routes.map((rte: RouteProps) =>
        rte.id === updateRoute.id ? updateRoute : rte
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRoute]);

  // Handle the state of updateRoute with routes changes
  useEffect(() => {
    const update = routes.find((rte: RouteProps) => rte.id === updateRoute.id);
    if (!update) return;
    setUpdateRoute(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  // Add a new point to the route if a point is set on the map
  useEffect(() => {
    if (!point) return;
    setUpdateRoute({
      ...updateRoute,
      points: [
        ...updateRoute.points,
        { ...point, name: "WP " + (updateRoute.points.length + 1) },
      ],
    });
    setPoint(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point]);

  const handleUpdateRoute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate("/");
  };

  const handleAddPoint = () => {
    setUpdateRoute({
      ...updateRoute,
      points: [...updateRoute.points, newPoint],
    });
    setNewPoint({
      id: generateRandomId(),
      name: "",
      lat: 0,
      lng: 0,
    });
  };

  const handleRemoveWaypoint = (id: string) => () => {
    setUpdateRoute({
      ...updateRoute,
      points: [...updateRoute.points.filter((p: WaypointProps) => p.id !== id)],
    });
  };

  return (
    <div className="routes-container">
      <div className="routes-header">
        <div className="routes-header-left">
          <button
            onClick={() => {
              setRoutes([
                ...routes.map((rte: RouteProps) =>
                  rte.id === id ? oldRoute : rte
                ),
              ]);
              navigate("/");
            }}
          >
            {"<"}
          </button>
          <h1>Mise à jour de la route</h1>
        </div>
      </div>

      {updateRoute && (
        <form onSubmit={handleUpdateRoute} className="routes-form">
          <label>Nom de la route :</label>
          <input
            required
            type="text"
            placeholder="Routage 1"
            value={updateRoute?.name}
            onChange={(e) =>
              setUpdateRoute({ ...updateRoute, name: e.target.value })
            }
          />

          <label>Date de début :</label>
          <input
            type="date"
            required
            value={updateRoute?.startDate}
            onChange={(e) =>
              setUpdateRoute({ ...updateRoute, startDate: e.target.value })
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
              {updateRoute?.points.map((point: WaypointProps) => (
                <tr key={point.id}>
                  <td>{point.name}</td>
                  <td style={{ textAlign: "right" }}>
                    {Boolean(editWaypoint?.id === point.id) ? (
                      <input
                        type="number"
                        style={{ width: "50px" }}
                        value={point.lat}
                        onChange={(e) =>
                          setUpdateRoute({
                            ...updateRoute,
                            points: updateRoute.points.map(
                              (p: WaypointProps) => {
                                if (p.id === point.id) {
                                  return { ...p, lng: Number(e.target.value) };
                                }
                                return p;
                              }
                            ),
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
                          setUpdateRoute({
                            ...updateRoute,
                            points: updateRoute.points.map(
                              (p: WaypointProps) => {
                                if (p.id === point.id) {
                                  return { ...p, lng: Number(e.target.value) };
                                }
                                return p;
                              }
                            ),
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
                      onClick={() =>
                        setEditWaypoint(editWaypoint ? null : point)
                      }
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
                type="number"
                max={90}
                min={-90}
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
                type="number"
                max={360}
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
            disabled={updateRoute.points.length === 0}
            type="submit"
          >
            Mettre à jour
          </button>
        </form>
      )}
    </div>
  );
};

export default RouteUpdate;
