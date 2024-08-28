import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import "./index.scss";
import { RouteProps } from "../../models";
import Cookies from "js-cookie";
import { COOKIE_DATA } from "../../configs/config";
import { RouteContext } from "../../contexts";

const RouteIndex = () => {
  const navigate = useNavigate();

  const { route, setRoute } = useContext(RouteContext);

  const [routes, setRoutes] = useState<Array<RouteProps>>([]);

  useEffect(() => {
    setRoutes(JSON.parse(Cookies.get(COOKIE_DATA) || "[]"));
  }, []);

  const handleDeleteRoute = (id: string) => () => {
    const newRoutes = routes.filter((rte: RouteProps) => rte.id !== id);
    Cookies.set(COOKIE_DATA, JSON.stringify(newRoutes));
    setRoutes(newRoutes);
  };

  return (
    <div className="routes-container">
      <div className="routes-header">
        <h1>Routes</h1>
        <button
          onClick={() => {
            navigate("/create");
          }}
        >
          Add
        </button>
      </div>

      <div className="routes-list">
        {routes.map((rte: RouteProps) => (
          <div className="row-route" key={rte.id}>
            <p
              style={{
                textDecoration: route?.id === rte.id ? "underline" : "none",
              }}
            >
              {rte.name}
            </p>
            <div className="row-route-actions">
              <button
                onClick={() => {
                  setRoute(rte);
                }}
              >
                <Visibility />
              </button>
              <button
                onClick={() => {
                  setRoute(rte);
                  navigate("/edit/" + rte.id);
                }}
              >
                <Edit />
              </button>
              <button onClick={handleDeleteRoute(rte.id)}>
                <Delete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteIndex;
