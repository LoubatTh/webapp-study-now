import { access } from "fs";
import { useAuth } from "../contexts/AuthContext";
import { getCookie } from "../utils/cookie";

const Homepage = () => {

  const { accessToken } = useAuth();
  const refreshToken = getCookie('refreshToken');

return (
    <>
      <p>HomePage</p>
      <p>Token : {accessToken}</p>
      <p>RefreshToken : {refreshToken} </p>
    </>
  )
};

export default Homepage;
