import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useDisableScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, [location]);
}