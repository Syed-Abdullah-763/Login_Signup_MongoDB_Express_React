import React, { useState } from "react";
import styles from "./otp.module.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("OTP will be expired in 1 minute");

  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (otp.length < 6) return setMessage("Please enter the 6-digit OTP");
    setLoading(true);

    try {
      const email = location?.state?.email;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/verify-otp`,
        {
          otp,
          email,
        }
      );

      setMessage(response.data.message);

      navigate("/login");
    } catch (err) {
      alert(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const email = location?.state?.email;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/resend-otp`,
        {
          email,
        }
      );

      setMessage((await response).data.message);
    } catch (error) {
      alert(err.response.data.message);
    }
  };

  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div className={styles.brandMark}>🔒</div>
          <h1 className={styles.title}>Verify OTP</h1>
          <p className={styles.subtitle}>
            Enter the 6-digit code sent to your email
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={styles.input}
            placeholder="Enter OTP"
          />

          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {message && <p className={styles.message}>{message}</p>}
        </form>

        <footer className={styles.footer}>
          <p>
            Didn’t get a code?{" "}
            <button className={styles.link} onClick={resendOtp}>
              Resend OTP
            </button>
          </p>
        </footer>
      </section>
    </main>
  );
}
