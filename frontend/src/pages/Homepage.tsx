import { useAuth } from "../contexts/AuthContext";


const Homepage = () => {

  const { accessToken, receivedAt, setAccessToken, logout } = useAuth();

  // TEST D'AUTHENTIFICATION
  return (
    <>
      <p>Token: {accessToken}</p>
      <p>receivedAt : {receivedAt}</p>
      <br />
      <br />
      <button onClick={() => setAccessToken(crypto.randomUUID(), Date.now())}>Login</button>
      <br />
      <button onClick={logout}>Logout</button>
    </>
  )
};

export default Homepage;
