import { createContext, useState, useContext, useEffect } from 'react';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import { parseISODateToMilis } from '../utils/dateparser';
import type { AuthContextType } from '../types/AuthContext.type';
import { fetchApi } from '@/utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*
Création d'un Hook custom permettant de s'assurer que celui-ci est : 
- créer dans le bon context
- assurer une accessibilité plus simple aux attributs et fonctions du context
*/
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }

  useEffect(() => {
    const verifyToken = async () => {
      await context.checkToken();
    };
    verifyToken();
  }, [context]);

  return context;
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  /*
  useEffect permettant de vérifier si un refreshToken est présent lors du premier chargement du site
  permettant d'authentifier l'utilisateur directement sans qu'il ait à se reconnecter 
  */
  useEffect(() => {
    refreshToken().finally(() => setIsReady(true));
  }, [])

  /*
  Méthode "officielle" pour enregistrer le token de l'utilisateur,
  */
  const setToken = (access_token: string, access_token_expiration: string, refresh_token: string, refresh_token_expiration: string) => {
    //Access token
    updateToken(access_token, access_token_expiration);

    //RefreshToken
    setCookie('refreshToken', refresh_token, refresh_token_expiration)
  };

  /*
  Méthode permettant d'update le token de l'utilisateur lorsqu'il est refresh
  */
  const updateToken = (access_token: string, access_token_expiration: string) => {
    setAccessToken(access_token)
    setExpiresAt(parseISODateToMilis(access_token_expiration));
    
  }

  /*
  Méthode permettant de déconnecter l'utilisateur en supprimant le 
  l'accessToken, le refreshToken et la date d'expiration, et en appelant la route /api/logout 
  */
  const logout = () => {
      setAccessToken(null);
      setExpiresAt(null);
      deleteCookie('refreshToken')
    
      fetchApi("POST", "logout", null, accessToken);
  };

  /*
  Méthode permettant de vérifier la validité du token, déjà si il y en a un, 
  et puis si c'est le cas, vérifier si sa date d'expiration est passé, si oui, alors la méthode refreshToken est appelé
  */
  const checkToken = async () => {
      const now = Date.now();
      if(accessToken == null){
        return false;
      }

      if(expiresAt && now > expiresAt){
        return await refreshToken();
      }

      return true;
  };

  /*
  Méthode permettant de récupérer un nouvel accessToken A CONDITION que le refreshToken soit encore valide.
  */
  const refreshToken = async () => {
      const refreshToken = getCookie('refreshToken');
      if(!refreshToken){
        return false;
      }

      const response = await fetchApi("GET", "refresh", null, refreshToken);

      const data = await response.data;
      updateToken(data.access_token, data.access_token_expiration);
      return true;
    }


  return (
    <AuthContext.Provider value={{ accessToken, expiresAt: expiresAt, setToken, logout, checkToken, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};