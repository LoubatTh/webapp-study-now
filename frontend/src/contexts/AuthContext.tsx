import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

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
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  /*
  useEffect permettant de vérifier si un refreshToken est présent lors du premier chargement du site
  permettant d'authentifier l'utilisateur directement sans qu'il ait à se reconnecter 
  */
  useEffect(() => {
    console.log("chargement initial de la page")
    refreshToken();
  }, [])

  /*
  Méthode "officielle" pour enregistrer le token de l'utilisateur,
  */
  const setToken = (token: string, refreshToken: string, expiresAt: number) => {
    setAccessToken(token);
    setExpiresAt(expiresAt);
    setCookie('refreshToken', refreshToken, 7) //Le cookie expirera dans 7 jours
  };

  /*
  Méthode permettant d'update le token de l'utilisateur lorsqu'il est refresh
  */
  const updateToken = (token: string) => {
    setAccessToken(token)
    setExpiresAt(Date.now() + 15 * 1000)
  }

  /*
  Méthode permettant de déconnecter l'utilisateur en supprimant le 
  l'accessToken, le refreshToken (TODO) et la date d'expiration
  */
  const logout = () => {
      setAccessToken(null);
      setExpiresAt(null);
      deleteCookie('refreshToken')

      // TODO: Utiliser l'utils api.ts lorsque la méthode pour fetch avec un bearer token sera prête
      fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
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
        console.log("le token doit être rafraîchis")
        return await refreshToken();
      }

      console.log("le token n'a pas besoin d'être rafraîchis")
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

      // TODO: Utiliser l'utils api.ts lorsque la méthode pour fetch avec un bearer token sera prête
      const response = await fetch("http://localhost:8000/api/refresh", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`
        },
      });

      if (!response.ok){
        return false;
      }

      const data = await response.json();
      updateToken(data.token);
      console.log("le token a bien été rafraîchis")

      return true;
    }


  return (
    <AuthContext.Provider value={{ accessToken, expiresAt: expiresAt, setToken, logout, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};