"use client";
import styles from "../styles/Navbar.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register" || pathname === "/reset") {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/home">🎵 KodigoMusic</Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/login">Cerrar Sesión</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
