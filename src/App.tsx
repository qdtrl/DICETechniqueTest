import { RouteProps } from "./models";
import { Drawer, Map } from "./components";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import { RouteContext } from "./contexts";

const App = () => {
  const [route, setRoute] = useState<RouteProps | null>(null);

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      <Map />
      <Drawer />
    </RouteContext.Provider>
  );
};

export default App;
