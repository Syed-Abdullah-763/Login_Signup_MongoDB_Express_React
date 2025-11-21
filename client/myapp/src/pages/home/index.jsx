import React from "react";
import LandingNavbar from "../../components/landingNavbar";
import styles from "./home.module.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <LandingNavbar />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.badge}>Auth-ready React starter</p>
            <h1 className={styles.title}>
              Clean auth pages,
              <span> ready before your backend is.</span>
            </h1>
            <p className={styles.subtitle}>
              Lightweight login, OTP, and password flows built with React, Vite,
              and CSS Modules. Focus on your logic, not the UI.
            </p>

            <div className={styles.heroActions}>
              <button
                className={styles.heroPrimary}
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Get Started
              </button>
              <button className={styles.heroGhost}>View Docs</button>
            </div>

            <p className={styles.mutedNote}>
              No signup required to explore. Plug in your API when you’re ready.
            </p>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardTitle}>Auth preview</p>
              <p className={styles.cardLine}>• Login with email & password</p>
              <p className={styles.cardLine}>• OTP verification</p>
              <p className={styles.cardLine}>• Forgot & change password</p>
              <p className={styles.cardHint}>Styled with pure CSS Modules.</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className={styles.features}>
          <h2>Why this starter?</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>Ready-made auth UI</h3>
              <p>
                Login, OTP, forgot password, and change password screens with
                consistent design and responsive layout.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Clean code structure</h3>
              <p>
                Separated components, CSS Modules, and simple patterns that you
                can extend or replace easily.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Vite + React friendly</h3>
              <p>
                Works perfectly in Vite projects with environment variables,
                routing, and JWT-based APIs.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className={styles.how}>
          <h2>How it works</h2>
          <ol className={styles.steps}>
            <li>Clone or drop the components into your Vite React project.</li>
            <li>Wire the forms to your login / OTP / reset APIs.</li>
            <li>Protect routes with JWT and enjoy the ready-made UI.</li>
          </ol>
        </section>

        {/* Pricing (dummy) */}
        <section id="pricing" className={styles.pricing}>
          <h2>Simple pricing</h2>
          <div className={styles.priceCard}>
            <p className={styles.priceLabel}>Starter</p>
            <p className={styles.price}>Free</p>
            <p className={styles.priceNote}>
              Use the layout, tweak the design, and connect your own backend.
            </p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} NovaAuth. Built with React & Vite.</p>
      </footer>
    </div>
  );
}
