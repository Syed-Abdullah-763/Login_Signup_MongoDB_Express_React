import React, { useState } from "react";
import styles from "./navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className={styles.navWrapper}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>N</span>
          <span className={styles.logoText}>NovaAuth</span>
        </div>

        <input type="checkbox" id="nav-toggle" className={styles.toggle} />
        <label htmlFor="nav-toggle" className={styles.burger}>
          <span />
          <span />
          <span />
        </label>

        <div className={styles.links}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Contact
          </NavLink>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
