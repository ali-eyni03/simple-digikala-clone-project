import navDigiLogo from "../../../assets/digidownload.png";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";
import { TiMessages } from "react-icons/ti";
import { MdNotificationsNone } from "react-icons/md";
import { TfiWallet } from "react-icons/tfi";
import "./sellerProfileNavbar.css"
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FaList } from "react-icons/fa";
const SellerProfileNavbar = () => {
  const navigate = useNavigate();
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  return (
    <div className="bg-white shadow-md sticky top-0 z-40">
      <nav className="flex items-center justify-between p-2 w-[90%] m-auto">
        {/* Left section */}
        <div className="flex gap-4 text-gray-500 font-semibold">
          <Link to="/seller-profile" className="items-center w-40">
            <img src={navDigiLogo} alt="" className="w-23 h-10" />
          </Link>
          
          <div 
            className="relative flex gap-2 items-center justify-center ml-4 cursor-pointer"
            onMouseEnter={() => setShowProductDropdown(true)}
            onMouseLeave={() => setShowProductDropdown(false)}
          >
            <span>محصولات</span>
            <FaAngleDown />
            
            {showProductDropdown && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                <Link 
                  to="/seller-profile/products/create" 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <FaPlus className="text-green-500" />
                  <span>درج محصول جدید</span>
                </Link>
                <Link 
                  to="/seller-profile/products/manage" 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t"
                >
                  <FaList className="text-blue-500" />
                  <span>مدیریت محصولات</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-row-reverse items-center justify-center gap-3 text-gray-600">
          <Link to="/seller-profile/messages" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <TiMessages size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
          
          <Link to="/seller-profile/notifications" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MdNotificationsNone size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
          
          <Link to="/seller-profile/wallet" className="flex gap-2 items-center justify-center rounded-lg bg-gray-200 font-semibold h-10 px-3 hover:bg-gray-300 transition-colors">
            <TfiWallet size={20} />
            <span>۰ ریال</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default SellerProfileNavbar;