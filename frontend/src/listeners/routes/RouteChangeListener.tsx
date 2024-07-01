import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/*
Mettre ici toutes les routes que l'on souhaite exclure de la vérification d'authentification
*/
const excludedRoutes = ["/", "/login", "/legacylogin", "/create-quizz"];

const RouteChangeListener = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkToken, logout, isReady } = useAuth();

  useEffect(() => {
    const verifyAccess = async () => {
      /*
       Attendre que le AuthContext soit initialisé avant de vérifier l'accès
        */
      if (!isReady) return;

      /*
          Si cette page ne nécessite pas d'authentification alors on ne fait rien
          */
      if (excludedRoutes.includes(location.pathname)) {
        return;
      }

      const tokenIsValid = await checkToken();
      if (excludedRoutes.includes(location.pathname)) {
        return;
      }

      const tokenIsValid = await checkToken();

      /*
      /*
          Si le token n'est plus valide alors on redirige vers la page de login
          */
      if (!tokenIsValid) {
        console.log("La validation du token a échoué, redirection vers /login");
        logout();
        navigate("/login");
      }
    };
      if (!tokenIsValid) {
        console.log("La validation du token a échoué, redirection vers /login");
        logout();
        navigate("/login");
      }
    };

    verifyAccess();
  }, [location, isReady]);

  return null;
  return null;
};

export default RouteChangeListener;

