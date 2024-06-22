import { createContext, useState, ReactNode, useContext } from 'react';

type AuthContextType = {
    accessToken: string | null;
    receivedAt: number | null;
    setAccessToken: (token: string | null, receivedAt: number | null) => void;
    logout: () => void;
    checkToken: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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


    const handleSetAccessToken = (token: string | null, receivedAt: number | null) => {
        setAccessToken(token);
        setReceivedAt(receivedAt);
    };

    const logout = () => {
        setAccessToken(null);
        setReceivedAt(null);
    };

    const checkToken = () => {
      return accessToken !== null;
        // const now = new Date().getTime();
        // const delay = 3 * 60 * 60 * 1000; // 3 heures en millisecondes
        // if (receivedAt && (now > (receivedAt + delay))) {
        //   //  TODO: Gérer le refresh token ici
        // }
    };

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