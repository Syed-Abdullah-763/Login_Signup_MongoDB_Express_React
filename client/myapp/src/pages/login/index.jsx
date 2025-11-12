import React, { useState } from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      if (!form.email || !form.password) {
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/login`,
        form
      );

      setMessage(response.data.message);
    } catch (err) {
      alert(err.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // TODO: Route to your forgot-password page or open modal
    setMessage("Password reset link flow goes here (demo).");
  };

  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div className={styles.brandMark} aria-hidden>
            <span>●</span>
          </div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to continue</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
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

          <div className={styles.actionsRow}>
            <label className={styles.remember}>
              <input type="checkbox" className={styles.checkbox} />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgetpassword"
              className={styles.link}
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Link>
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
            Don’t have an account?{" "}
            <p className={styles.link}>
              <Link to="/signup">create new account?</Link>
            </p>
          </p>
        </footer>
      </section>
    </main>
  );
}
