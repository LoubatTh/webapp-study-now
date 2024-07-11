import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Outlet } from "react-router-dom";

const LayoutNavbarPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col flex-grow p-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default LayoutNavbarPage;
