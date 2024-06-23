import { useAuth } from '../contexts/AuthContext';
import { deleteCookie } from '../utils/cookie';

const LoginPage = () => {

  const { setToken, logout } = useAuth();

  const body = {
    "email": "nathan.dulac@epitech.eu",
    "password": "password"
  }

  async function getToken() {

    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    console.log(data);
    setToken(data.token, data.refresh_token, Date.now() + 15 * 1000);

  }

   const deleteRefreshToken = () => {

    deleteCookie('refreshToken');
    
  }

  return (
    <>
      <div>Login Page</div>
      <br />
      <br />
      <button onClick={getToken}>Login</button>
      <br />
      <button onClick={logout}>Logout</button>
      <br />
      <button onClick={deleteRefreshToken}>Delete RefreshToken</button>
    </>
  )
}

export default LoginPage