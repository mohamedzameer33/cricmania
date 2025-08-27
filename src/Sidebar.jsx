import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="menu col-12 col-sm-4 col-md-2">
      <h4
        className="mt-2 ms-3 fw-bold text-warning"
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          textAlign: "center",
        }}
      >
        Cric Mania Zameer
      </h4>
      <div className="line1"></div>
      <NavLink
        to="/" // Changed to "/" to match the root route
        className={({ isActive }) =>
          `menus ${isActive ? "active bg-primary text-white" : ""}`
        }
      >
        Home
        <ion-icon className="menuicon" name="grid"></ion-icon>
      </NavLink>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `menus ${isActive ? "active bg-primary text-white" : ""}`
        }
      >
        Dashboard
        <ion-icon className="menuicon" name="stats-chart"></ion-icon>
      </NavLink>
      <NavLink
        to="/super-over"
        className={({ isActive }) =>
          `menus ${isActive ? "active bg-primary text-white" : ""}`
        }
      >
        Super Over
        <ion-icon className="menuicon" name="people-circle-outline"></ion-icon>
      </NavLink>
      <NavLink
        to="/save"
        className={({ isActive }) =>
          `menus ${isActive ? "active bg-primary text-white" : ""}`
        }
      >
        Save
        <ion-icon className="menuicon" name="save"></ion-icon>
      </NavLink>
      <NavLink
        to="/logout"
        className={({ isActive }) =>
          `menus ${isActive ? "active bg-primary text-white" : ""}`
        }
      >
        Log out
        <ion-icon className="menuicon" name="log-out"></ion-icon>
      </NavLink>
    </div>
  );
};

export default Sidebar;
