"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Link from "next/link";
import styles from "../styles/authForm.module.css"; 

type FormData = {
  email: string;
};

const ResetPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setNotification(null);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setNotification("Password reset email sent successfully! Check your inbox.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Reset Password</h1>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Email"}
          </button>
          {notification && <p className={styles.notification}>{notification}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </form>

        <p className={styles.footer}>
          Remembered your password? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPage;
