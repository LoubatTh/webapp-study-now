import { useAuth } from "../contexts/AuthContext";
import { getCookie } from "../utils/cookie";

const Homepage = () => {

  const { accessToken, logout } = useAuth();
  const refreshToken = getCookie('refreshToken');

return (
    <>
      <p>HomePage</p>
      <p>Token : {accessToken}</p>
      <p>RefreshToken : {refreshToken} </p>
      <button onClick={logout}>Logout</button>
    </>
  )
};

export default Homepage;
