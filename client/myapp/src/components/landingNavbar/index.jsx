import React, { useState } from "react";
import styles from "./landingNavbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function LandingNavbar() {
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
            to="/"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/feature"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Features
          </NavLink>

          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Pricing
          </NavLink>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.secondaryBtn}
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
          <button
            className={styles.primaryBtn}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}
