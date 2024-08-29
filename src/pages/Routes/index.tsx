import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import "./index.scss";
import { RouteProps } from "../../models";
import { RoutesContext } from "../../contexts";

const RouteIndex = () => {
  const navigate = useNavigate();

  const { routes, setRoutes } = useContext(RoutesContext) as any;

  const handleDeleteRoute = (id: string) => () => {
    setRoutes(routes.filter((rte: RouteProps) => rte.id !== id));
  };

  return (
    <div className="routes-container">
      <div className="routes-header">
        <h1>Routes</h1>
        <button
          onClick={() => {
            navigate("/create");
            setRoutes([
              ...routes.map((rte: RouteProps) => ({ ...rte, show: false })),
            ]);
          }}
        >
          Add
        </button>
      </div>

      <div className="routes-list">
        {routes.map((route: RouteProps) => (
          <div className="row-route" key={route.id}>
            <p>{route.name}</p>
            <div className="row-route-actions">
              <button
                onClick={() => {
                  setRoutes(
                    routes.map((rte: RouteProps) =>
                      route.id === rte.id ? { ...rte, show: !rte.show } : rte
                    )
                  );
                }}
              >
                {route.show ? <Visibility /> : <VisibilityOff />}
              </button>
              <button
                onClick={() => {
                  setRoutes(
                    routes.map((rte: RouteProps) =>
                      route.id === rte.id
                        ? { ...rte, show: true }
                        : { ...rte, show: false }
                    )
                  );
                  navigate("/edit/" + route.id);
                }}
              >
                <Edit />
              </button>
              <button onClick={handleDeleteRoute(route.id)}>
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
