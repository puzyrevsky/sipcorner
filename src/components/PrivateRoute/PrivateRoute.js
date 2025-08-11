import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{margin: '0 auto', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p>Загрузка...</p></div>;

  return authenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
