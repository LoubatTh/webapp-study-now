import Footer from "@/components/footer";
import { Outlet } from "react-router-dom";
import { AuroraBackground } from "../components/ui/aurora-background";
import Navbar from "@/components/navbar";

const LayoutNavbarPage = () => {
  return (
    <AuroraBackground>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <div className="flex flex-col flex-grow z-40">
          <Outlet />
        </div>
        <Footer />
      </div>
    </AuroraBackground>
  );
};

export default LayoutNavbarPage;
