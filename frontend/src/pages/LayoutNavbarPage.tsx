import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Outlet } from "react-router-dom";
import { AuroraBackground } from "../components/ui/aurora-background";

const LayoutNavbarPage = () => {
  return (
    // <AuroraBackground>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <div className="flex flex-col flex-grow z-10 p-4">
          <Outlet />
        </div>
        <Footer />
      </div>
    // </AuroraBackground>
  );
};

export default LayoutNavbarPage;
