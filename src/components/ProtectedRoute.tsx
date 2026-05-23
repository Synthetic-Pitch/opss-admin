import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });
    console.log('hello');
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!authenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;