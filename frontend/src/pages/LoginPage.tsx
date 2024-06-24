import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { deleteCookie } from '../utils/cookie';

const LoginPage = () => {
  const { accessToken, setToken, logout, checkToken } = useAuth();
  const [message, setMessage] = useState("");

  // Infos de connexion pré-remplies pour la simplicité de l'exemple
  const body = {
    "email": "nathan.dulac@epitech.eu",
    "password": "password"
  };

  // Fonction pour obtenir le token
  const handleGetToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      console.log(data);
      setToken(data.accessToken, data.accessTokenExpiration, data.refreshToken, data.refreshTokenExpiration);
      setMessage("Vous êtes connecté.");
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la connexion.");
    }
  };

  // Fonction pour supprimer le refreshToken
  const deleteRefreshToken = () => {
    deleteCookie('refreshToken');
    setMessage("Refresh token supprimé. L'accessToken est toujours présent, mais sera invalide à la fin de la date d'expiration ou si vous rechargez la page.");
  };

  // Vérification du token à chaque chargement de la page
  useEffect(() => {
    const verifyToken = async () => {
      const isValid = await checkToken();
      setMessage(isValid ? "Token valide ✅" : "Token introuvable ou invalide. ❌");
    };
    verifyToken();
  }, [checkToken]);

  return (
    <>
      <div>Login Page</div>
      <p style={{ color: message.includes("Token valide") ? 'green' : 'red' }}>{message}</p>
      <div className="space-x-1">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleGetToken}>Login</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={logout}>Logout</button>
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={deleteRefreshToken}>Delete RefreshToken</button>
      </div>
    </>
  );
}

export default LoginPage;
