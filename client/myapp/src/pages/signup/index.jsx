import React, { useState } from "react";
import styles from "./signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LandingNavbar from "../../components/landingNavbar";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      if (!form.email || !form.password || !form.name || !form.age) {
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/signup`,
        form
      );

      setMessage(response.data.message);

      navigate("/otp-verification", {
        replace: true,
        state: {
          email: form.email,
          token: response.data.token,
        },
      });
    } catch (err) {
      alert(err.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <LandingNavbar />

      <main className={styles.wrapper}>
        <section className={styles.card}>
          <header className={styles.header}>
            <div className={styles.brandMark} aria-hidden>
              <span>●</span>
            </div>
            <h1 className={styles.title}>Welcome</h1>
            <p className={styles.subtitle}>Sign up to continue</p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name..."
                required
                className={styles.input}
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="age" className={styles.label}>
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                placeholder="Enter your age..."
                required
                className={styles.input}
                value={form.age}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                required
                className={styles.input}
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordRow}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={styles.input}
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={styles.ghostBtn}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>

            {message ? <p className={styles.message}>{message}</p> : null}
          </form>

          <footer className={styles.footer}>
            <p>
              Already have an account?{" "}
              <p className={styles.link}>
                <Link to="/login">Login?</Link>
              </p>
            </p>
          </footer>
        </section>
      </main>
    </>
  );
}
