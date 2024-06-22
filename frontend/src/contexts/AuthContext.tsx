import { createContext, useState, ReactNode, useContext } from 'react';

type AuthContextType = {
    accessToken: string | null;
    receivedAt: number | null;
    setAccessToken: (token: string | null, receivedAt: number | null) => void;
    logout: () => void;
    checkToken: () => boolean;
}

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
  const [receivedAt, setReceivedAt] = useState<number | null>(null);

    /*
    Méthode "officielle" pour enregistrer le token de l'utilisateur,
    TODO: Trouver un nom plus simple et plus parlant
    */
    const handleSetAccessToken = (token: string | null, receivedAt: number | null) => {
        setAccessToken(token);
        setReceivedAt(receivedAt);
    };

    /*
    Méthode permettant de déconnecter l'utilisateur en supprimant le 
    l'accessToken, le refreshToken (TODO) et la date de reçu
    */
    const logout = () => {
        setAccessToken(null);
        setReceivedAt(null);
    };

    /*
    Méthode permettant de vérifier la validité du token, déjà si il y en a un, 
    et puis si c'est le cas, vérifier si sa date d'expiration est passé, si oui, alors la méthode refreshToken est appelé
    */
    const checkToken = () => {
      return accessToken !== null;
        // const now = new Date().getTime();
        // const delay = 3 * 60 * 60 * 1000; // 3 heures en millisecondes
        // if (receivedAt && (now > (receivedAt + delay))) {
        //   //  TODO: Gérer le refresh token ici
        // }
    };

    /*
    Méthode permettant de récupérer un nouvel accessToken A CONDITION que le refreshToken soit encore valide.
    */
    const refreshToken = () => {
        //TODO: ici mettre le code pour récupérer le nouveau accessToken a condition que le refreshToken soit encore valide, sinon rediriger vers la page de login
    }

  return (
    <AuthContext.Provider value={{
            accessToken,
            receivedAt,
            setAccessToken: handleSetAccessToken,
            logout,
            checkToken
        }}>
      {children}
    </AuthContext.Provider>
  );
};