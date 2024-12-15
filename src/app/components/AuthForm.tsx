"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../firebaseConfig";
import Link from "next/link";
import styles from "../styles/AuthForm.module.css";

type FormData = {
  email: string;
  password: string;
};

type AuthFormProps = {
  type: "login" | "register" | "reset";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true); 
    try {
      if (type === "login") {
       
        const userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        console.log("Usuario autenticado:", userCredential.user);
        router.push("/home"); 
      } else if (type === "register") {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        setNotification("¡Cuenta creada con éxito! Redirigiendo a iniciar sesión...");
        setTimeout(() => {
          router.push("/login");
        }, 1500); 
      } else if (type === "reset") {
        await sendPasswordResetEmail(auth, data.email);
        setNotification("Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada.");
      }
    } catch (err) {
      console.error("Error durante el proceso:", err);
      if (err instanceof Error) {
        if (type === "login") {
          setError("Correo o contraseña incorrectos. Intenta de nuevo.");
        } else if (type === "register") {
          setError("Hubo un problema al crear la cuenta. Intenta de nuevo.");
        } else if (type === "reset") {
          setError("Hubo un problema al enviar el correo de recuperación.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/home");
    } catch (err) {
      console.error("Error al iniciar sesión con Google:", err);
      if (err instanceof Error) {
        setError("Hubo un problema al iniciar sesión con Google. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>
            {type === "login"
              ? "¡Bienvenido de nuevo!"
              : type === "register"
              ? "Crea una cuenta"
              : "Recuperar contraseña"}
          </h1>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Correo electrónico"
            {...register("email", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Formato de correo electrónico inválido",
              },
            })}
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}

          {type !== "reset" && (
            <>
              <input
                type="password"
                placeholder="Contraseña"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                className={styles.input}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </>
          )}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading
              ? "Procesando..."
              : type === "login"
              ? "Iniciar sesión"
              : type === "register"
              ? "Registrarse"
              : "Enviar correo de recuperación"}
          </button>
          {notification && <p className={styles.notification}>{notification}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </form>

        {type === "login" && (
          <p className={styles.forgot}>
            <Link href="/reset">¿Olvidaste tu contraseña?</Link>
          </p>
        )}

        <div className={styles.divider}>O continúa con</div>
        <div className={styles.socials}>
          <button onClick={handleGoogleSignIn} className={styles.google}>
            Google
          </button>
        </div>

        {type === "login" ? (
          <p className={styles.footer}>
            ¿No tienes una cuenta? <Link href="/register">Regístrate</Link>
          </p>
        ) : (
          <p className={styles.footer}>
            ¿Ya tienes una cuenta? <Link href="/login">Inicia sesión</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
