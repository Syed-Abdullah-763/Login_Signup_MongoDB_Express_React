import React, { useState } from "react";
import styles from "./changePassword.module.css";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("q");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.newPassword || !form.confirmPassword) {
      return setError("Please fill in all fields");
    }

    if (form.newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }

    if (form.newPassword !== form.confirmPassword) {
      return setError("New password and confirm password do not match");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/change-password`,
        {
          newPassword: form.confirmPassword,
          token,
        }
      );

      setMessage(response.data.message);
      alert(response.data.message);
      setForm({ newPassword: "", confirmPassword: "" });

      navigate("/login");
    } catch (err) {
      setError(err.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div className={styles.brandMark}>🔐</div>
          <h1 className={styles.title}>Change Password</h1>
          <p className={styles.subtitle}>
            Update your password to keep your account secure.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="••••••••"
              className={styles.input}
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={styles.input}
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className={`${styles.message} ${styles.error}`}>{error}</p>
          )}
          {message && (
            <p className={`${styles.message} ${styles.success}`}>{message}</p>
          )}

          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </main>
  );
}
