import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import type { UserContextType } from "../types/UserContext.type";

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
    const { accessToken, isReady, setToken, logout} = useAuth();

    /*
    useEffect permettant de récupérer les informations de l'utilisateur
    */
    useEffect(() => {

        const fetchUser = async () => {
            if (accessToken) {
                const response = await fetch("http://localhost:8000/api/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

                const data = await response.json();
                handleSetUser(data);
            }
        }

        fetchUser();

    }, [isReady, setToken]);


    /* 
    useEffect permettant de supprimer les infos de l'utilisateurs lors de la déconnexion
    */
    useEffect(() => {
        handleClearUser();
    }, [logout]);

    /*
    Méthode permettant de set l'utilisateur dans le context
    */
    const handleSetUser = (newUser: UserContextType) => {
        setUser({ ...newUser });
    }

    /*
    Méthode permettant de clear l'utilisateur dans le context
    */
    const handleClearUser = () => {
        setUser({...defaultState });
    }

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

