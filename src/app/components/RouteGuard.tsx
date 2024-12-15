"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter(); 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true); 
      } else {
        setAuthenticated(false);
        router.push("/login"); 
      }
      setLoading(false); 
    });

    return () => unsubscribe(); 
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return authenticated ? <>{children}</> : null;
};

export default RouteGuard;
