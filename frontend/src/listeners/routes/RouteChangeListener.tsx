import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const excludedPages = [
  '/',
  '/login',
];

const RouteChangeListener = () => {

   const location = useLocation();
   const navigate = useNavigate();
   const { checkToken } = useAuth();

    useEffect(() => {

        /*
        Si cette page ne nécessite pas d'authentification alors on ne fait rien
        */
        if (excludedPages.includes(location.pathname)) {
           return;
        }

        /*
        Si le token n'est plus valide alors on redirige vers la page de login
        */
        if(!checkToken()){
            navigate("/login")
        }


    }, [location]);

     return null;

};

export default RouteChangeListener;