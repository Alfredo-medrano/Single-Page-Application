import { useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import HomePage from "./page";

const ProtectedHome = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); 
      }
    });
    return () => unsubscribe();
  }, [router]);

  return <HomePage />;
};

export default ProtectedHome;
