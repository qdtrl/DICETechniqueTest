import React, { Fragment, useState } from "react";
import { WaypointProps } from "./models";
import { Drawer, Map } from "./components";
import "mapbox-gl/dist/mapbox-gl.css";

const App = () => {
  const [route, setRoute] = useState<WaypointProps | null>(null);

  return (
    <Fragment>
      <Map route={route} />
      <Drawer setRoute={setRoute} />
    </Fragment>
  );
};

export default App;
