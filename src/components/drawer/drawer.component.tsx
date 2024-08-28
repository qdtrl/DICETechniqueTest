import React from "react";
import "./drawer.scss";

const Drawer = ({ setRoute }: { setRoute: Function }) => {
  return (
    <section className="drawer">
      <div className="drawer-header">
        <h1>Routes</h1>
        <button>Add</button>
      </div>
      <div className="footer">
        <p>React test - Quentin Touroul</p>
      </div>
    </section>
  );
};

export default Drawer;
