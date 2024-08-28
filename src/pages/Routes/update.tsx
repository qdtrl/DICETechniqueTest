import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteContext } from "../../contexts";
import { generateRandomId } from "../../functions";
import { WaypointProps, RouteProps } from "../../models";
import Cookies from "js-cookie";
import { COOKIE_DATA } from "../../configs/config";
import { Delete } from "@mui/icons-material";

const RouteUpdate = () => {
  const navigate = useNavigate();

  const { route, setRoute } = useContext(RouteContext);

  const [updateRoute, setUpdateRoute] = useState<RouteProps>(route);

  const [newPoint, setNewPoint] = useState<WaypointProps>({
    id: generateRandomId(),
    name: "",
    lat: 0,
    lng: 0,
  });

  const handleUpdateRoute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const oldRoutes = JSON.parse(Cookies.get(COOKIE_DATA) || "[]");

    Cookies.set(
      COOKIE_DATA,
      JSON.stringify(
        oldRoutes.map((rte: RouteProps) =>
          rte.id === updateRoute.id ? updateRoute : rte
        )
      )
    );

    setRoute(updateRoute);

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
          <h1>Mise à jour de la route</h1>
        </div>
      </div>

      <form onSubmit={handleUpdateRoute} className="routes-form">
        <label>Nom de la route :</label>
        <input
          type="text"
          placeholder="Routage 1"
          value={updateRoute.name}
          onChange={(e) =>
            setUpdateRoute({ ...updateRoute, name: e.target.value })
          }
        />

        <label>Date de début :</label>
        <input
          type="date"
          value={updateRoute.startDate}
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {updateRoute.points.map((point: WaypointProps) => (
              <tr key={point.id}>
                <td>{point.name}</td>
                <td style={{ textAlign: "right" }}>{point.lat}</td>
                <td style={{ textAlign: "right" }}>{point.lng}</td>
                <td>
                  <button
                    onClick={() =>
                      setUpdateRoute({
                        ...updateRoute,
                        points: [
                          ...updateRoute.points.filter(
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
            updateRoute.name === "" ||
            updateRoute.startDate === "" ||
            updateRoute.points.length === 0
          }
          type="submit"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default RouteUpdate;
