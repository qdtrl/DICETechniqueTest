import { RouteProps, WaypointProps } from "./models";
import { Drawer, Map } from "./components";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import { WaypointContext, RoutesContext } from "./contexts";
import Cookies from "js-cookie";
import { COOKIE_DATA } from "./configs/config";

const App = () => {
  const [routes, setRoutes] = useState<Array<RouteProps>>(
    JSON.parse(Cookies.get(COOKIE_DATA) || "[]")
  );

  const [point, setPoint] = useState<WaypointProps | null>(null);

  useEffect(() => {
    Cookies.set(COOKIE_DATA, JSON.stringify(routes));
  }, [routes]);

  return (
    <RoutesContext.Provider value={{ routes, setRoutes }}>
      <WaypointContext.Provider value={{ point, setPoint }}>
        <Map />
        <Drawer />
      </WaypointContext.Provider>
    </RoutesContext.Provider>
  );
};

export default App;
