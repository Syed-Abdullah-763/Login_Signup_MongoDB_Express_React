import React, { useState } from "react";
import styles from "./forgetPassword.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) return setMessage("Please enter your email address");

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/forget-password`,
        {
          email,
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div className={styles.brandMark}>✉️</div>
          <h1 className={styles.title}>Forgot Password?</h1>
          <p className={styles.subtitle}>
            Enter your registered email to receive a reset link.
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />

          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {message && <p className={styles.message}>{message}</p>}
        </form>

        <footer className={styles.footer}>
          <p>
            Remembered your password?{" "}
            <Link to={"/login"} className={styles.link}>
              Back to Login
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}
