import { ReactNode, createContext, useContext, useState } from "react";

const UserContext = createContext<UserContextType | undefined>(undefined);

/*
Création d'un contexte par défaut pour l'utilisateur
*/
const defaultState = {
    name: '',
    email: '',
    role: '',
    isSubscribed: false,
    email_verified_at: null,
    created_at: '',
    updated_at: '',
    setUser: () => {},
    clearUser: () => {},
};

/*
Création d'un Hook custom permettant de s'assurer que celui-ci est :
- créer dans le bon context
- assurer une accessibilité plus simple aux attributs et fonctions du context
*/
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser doit être utilisé dans un UserProvider');
    }
    return context;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<UserContextType>(defaultState);

    /*
    Méthode permettant de set l'utilisateur dans le context
    */
    const handleSetUser = (newUser: UserContextType) => {
        setUser({ ...newUser, setUser: handleSetUser, clearUser: handleClearUser });
    }

    /*
    Méthode permettant de clear l'utilisateur dans le context
    */
    const handleClearUser = () => {
        setUser({...defaultState, setUser: handleSetUser, clearUser: handleClearUser });
    }

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

