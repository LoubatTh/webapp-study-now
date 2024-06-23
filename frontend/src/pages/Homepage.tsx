import { useAuth } from "../contexts/AuthContext";
import { fetchApi } from "../utils/api";
import { deleteCookie, getCookie } from "../utils/cookie";


const Homepage = () => {

  const { accessToken, expiresAt } = useAuth();
  const refreshToken = getCookie('refreshToken');


  // TEST D'AUTHENTIFICATION
  return (
    <>
      <p>HomePage</p>
      <br />
      <p>Token: {accessToken}</p>
      <p>expiresAt : {expiresAt}</p>
      <p>refreshToken : {refreshToken} </p>
    </>
  )
};

export default Homepage;
