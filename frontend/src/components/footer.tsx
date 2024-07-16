import { useAuth } from "@/contexts/AuthContext";
import { Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/images/Logo-T-YEP.png";

const Footer = () => {
  const { accessToken, logout } = useAuth();
  // handle click for navigation btn
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  return (
    <div className="flex flex-col items-center mb-3.5 mt-20 border-t border-shadow-xl">
      <div className="flex justify-around w-full max-w-screen-lg mb-2.5 pt-6">
        <div className="">
          <h4 className="font-bold mb-2">Navigation</h4>
          <ul className="text-sm">
            <li className="cursor-pointer mt-2">
              <a onClick={() => handleNavigate("/")}>Home</a>
            </li>
            <li className="cursor-pointer mt-2">
              <a onClick={() => handleNavigate("/explore")}>Explore</a>
            </li>
            <li className="cursor-pointer mt-2">
              <a onClick={() => handleNavigate("/board")}>Board</a>
            </li>
            <li className="cursor-pointer mt-2">
              <a onClick={() => handleNavigate("/organization")}>
                Organization
              </a>
            </li>
          </ul>
        </div>
        <div className="">
          <h4 className="font-bold mb-2">Contribute</h4>
          <ul className="text-sm">
            <li className="cursor-pointer mt-2">
              <a className="flex items-center" href="" target="_blank">
                <Github className="w-4 mr-2" />
                GitHub
              </a>
            </li>
          </ul>
        </div>
        <div className="">
          <h4 className="font-bold mb-2">Account</h4>
          {!accessToken ? (
            <ul className="text-sm">
              <li className="cursor-pointer mt-2">
                <a onClick={() => handleNavigate("/login")}>Login</a>
              </li>
            </ul>
          ) : (
            <ul className="text-sm">
              <li className="cursor-pointer mt-2">
                <a onClick={() => handleNavigate("/profile")}>Profile</a>
              </li>
              <li className="cursor-pointer mt-2">
                <a onClick={() => handleNavigate("/premium")}>Premium</a>
              </li>
              <li className="cursor-pointer mt-2">
                <a
                  onClick={() => {
                    handleNavigate("/");
                    logout();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
      <hr className="m-4 h-1 w-2/3" />
      <div className="flex justify-center items-center">
        <img className="w-10" src={Logo} alt="logo" />
        <h4>StudyNow</h4>
      </div>
    </div>
  );
};

export default Footer;
