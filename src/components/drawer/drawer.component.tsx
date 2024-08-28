import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RouteCreate, RouteIndex, RouteUpdate } from "../../pages";
import "./drawer.scss";

const Drawer = () => {
  return (
    <section className="drawer">
      <Router>
        <Routes>
          <Route path="/" element={<RouteIndex />} />
          <Route path="/create" element={<RouteCreate />} />
          <Route path="/edit/:id" element={<RouteUpdate />} />
        </Routes>
      </Router>

      <div className="footer">
        <p>React test - Quentin Touroul</p>
      </div>
    </section>
  );
};

export default Drawer;
