export type AuthContextType = {
    accessToken: string | null; //A voir si laisser ce champ accessible partout dans le context est util (car un peu dangereux je trouve)
    expiresAt: number | null;
    isReady: boolean;
    setToken: (accessToken: string, accessTokenExpiration: string, refreshToken: string, refreshTokenExpiration: string) => void;
    logout: () => void;
    checkToken: () => boolean | Promise<boolean>;
}
