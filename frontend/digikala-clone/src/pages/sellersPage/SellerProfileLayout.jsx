import { Outlet } from "react-router-dom";
import SellerProfileMenu from "./SellerProfileMenu.jsx";
import SellerProfileNavbar from "./components/SellerProfileNavbar.jsx";

const SellerProfileLayout = () => {
  return (
    <div className="pb-8 min-h-screen flex flex-col bg-gray-50">
      <SellerProfileNavbar />
      <div className="container flex w-[90%] m-auto">
        <div className="menuContainer w-[40%] flex flex-col ">
          <SellerProfileMenu />
        </div>
        <div className="contentContainer w-full mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerProfileLayout;
