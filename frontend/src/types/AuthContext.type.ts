export type AuthContextType = {
  accessToken: string | null; //A voir si laisser ce champ accessible partout dans le context est utile (car un peu dangereux je trouve)
  expiresAt: number | null;
  setToken: (
    accessToken: string,
    accessTokenExpiration: string,
    refreshToken: string,
    refreshTokenExpiration: string
  ) => void;
  logout: () => void;
  checkToken: () => boolean | Promise<Boolean>;
  isReady: boolean;
};

export interface AuthTokenData {
  access_token: string;
  access_token_expiration: string;
  refresh_token: string;
  refresh_token_expiration: string;
}

export interface AuthRegisterData {
  username?: string,
  email: string,
  password: string,
  confirmPassword?: string,
}
