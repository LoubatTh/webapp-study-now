import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/*
  Define all routes that should be excluded from authentication check
*/
const excludedRoutes = [
  "/",
  "/login",
  "/explore",
  /^\/deck\/\d+$/,
  /^\/deck\/\d+\/result$/,
  /^\/quizz\/\d+$/,
  /^\/quizz\/\d+\/result$/,
];

const RouteChangeListener = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkToken, logout, isReady } = useAuth();

  useEffect(() => {
    const verifyAccess = async () => {
      // Wait for AuthContext to be initialized before verifying access
      if (!isReady) return;

      // Check if the current route matches any of the excluded routes
      const isExcludedRoute = excludedRoutes.some((route) =>
        route instanceof RegExp
          ? route.test(location.pathname)
          : route === location.pathname
      );

      // If this page does not require authentication, do nothing
      if (isExcludedRoute) {
        return;
      }

      const tokenIsValid = await checkToken();

      // If the token is no longer valid, redirect to the login page
      if (!tokenIsValid) {
        logout();
        navigate("/login");
      }
    };

    verifyAccess();
  }, [location, isReady]);

  return null;
};

export default RouteChangeListener;
