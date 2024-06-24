import { useAuth } from "../contexts/AuthContext";
import { fetchApi } from "../utils/api";
import { deleteCookie, getCookie, getCookieExpirationDate } from "../utils/cookie";


const Homepage = () => {

  const { accessToken, expiresAt } = useAuth();
  const refreshToken = getCookie('refreshToken');
  const refreshTokenExpirationDate = getCookieExpirationDate('refreshToken');

  // TEST D'AUTHENTIFICATION
  return (
    <>
      <p>HomePage</p>
      <br />
      <p>Token: {accessToken}</p>
      <p>tokenExpirationDate : {expiresAt}</p>
      <p>refreshToken : {refreshToken} </p>
      <p>refreshTokenExpirationDate: {refreshTokenExpirationDate} </p>
    </>
  )
};

export default Homepage;
