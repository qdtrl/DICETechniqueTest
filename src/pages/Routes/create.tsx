import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteProps, WaypointProps } from "../../models";
import "./create.scss";
import { Delete } from "@mui/icons-material";
import { generateRandomId } from "../../functions";
import { PointContext, RoutesContext } from "../../contexts";

const RouteCreate = () => {
  const navigate = useNavigate();

  const { routes, setRoutes } = useContext(RoutesContext) as any;
  const { point, setPoint } = useContext(PointContext);

  const [newRoute, setNewRoute] = useState<RouteProps>({
    id: generateRandomId(),
    show: true,
    name: "",
    startDate: "",
    points: [],
  });

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

    setRoutes([...routes, newRoute]);

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

  return (
    <div className="routes-container">
      <div className="routes-header">
        <div className="routes-header-left">
          <button
            onClick={() => {
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
          placeholder="Routage 1"
          value={newRoute.name}
          onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
        />

        <label>Date de début :</label>
        <input
          type="date"
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {newRoute.points.map((point: WaypointProps) => (
              <tr key={point.id}>
                <td>{point.name}</td>
                <td style={{ textAlign: "right" }}>{point.lat}</td>
                <td style={{ textAlign: "right" }}>{point.lng}</td>
                <td>
                  <button
                    onClick={() =>
                      setNewRoute({
                        ...newRoute,
                        points: [
                          ...newRoute.points.filter(
                            (p: WaypointProps) => p.id !== point.id
                          ),
                        ],
                      })
                    }
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "fit-content" }}>
            <label>Latitude :</label>
            <input
              style={{ width: "100px" }}
              type="number"
              value={newPoint.lat}
              onChange={(e) =>
                setNewPoint({ ...newPoint, lat: Number(e.target.value) })
              }
            />
          </div>
          <div style={{ width: "fit-content", paddingLeft: "auto" }}>
            <label>Longitude :</label>
            <input
              style={{ width: "100px" }}
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
          }}
          disabled={
            newRoute.name === "" ||
            newRoute.startDate === "" ||
            newRoute.points.length === 0
          }
          type="submit"
        >
          Créer
        </button>
      </form>
    </div>
  );
};

export default RouteCreate;
