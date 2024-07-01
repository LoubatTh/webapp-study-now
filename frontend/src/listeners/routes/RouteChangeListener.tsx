import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/*
Mettre ici toutes les routes que l'on souhaite exclure de la vérification d'authentification
*/
const excludedRoutes = ["/", "/login", "/create-quizz"];

const RouteChangeListener = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkToken, logout } = useAuth();

  useEffect(() => {
    const verifyAccess = async () => {
      /*
          Si cette page ne nécessite pas d'authentification alors on ne fait rien
          */
      if (excludedRoutes.includes(location.pathname)) {
        return;
      }

      const tokenIsValid = await checkToken();

      /*
          Si le token n'est plus valide alors on redirige vers la page de login
          */
      if (!tokenIsValid) {
        console.log("La validation du token a échoué, redirection vers /login");
        logout();
        navigate("/login");
      }
    };

    verifyAccess();
  }, [location]);

  return null;
};

export default RouteChangeListener;
