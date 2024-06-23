type AuthContextType = {
    accessToken: string | null; //A voir si laisser ce champ accessible partout dans le context est utile (car un peu dangereux je trouve)
    expiresAt: number | null;
    setToken: (token: string, refreshToken: string, expiresAt: number) => void;
    logout: () => void;
    checkToken: () => boolean | Promise<Boolean>;
}
