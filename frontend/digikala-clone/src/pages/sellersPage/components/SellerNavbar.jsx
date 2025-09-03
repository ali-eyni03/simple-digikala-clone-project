import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../auth/AuthContext";
import navLogo from "../../../assets/Digikala-Logo-white-fa.svg";
import navDigiLogo from "../../../assets/footerlogo2.png";
import { 
    FaUser, 
    FaSignOutAlt, 
    FaBars, 
    FaTimes,
    FaStore,
    FaBox,
    FaChartBar,
    FaCog
} from "react-icons/fa";
import axios from "axios";

const SellerNavbar = () => {
    const { authTokens, setAuthTokens, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSeller, setIsSeller] = useState(false);

    useEffect(() => {
        const checkSellerStatus = async () => {
            if (isAuthenticated && authTokens) {
                try {
                    const response = await axios.get(
                        "http://127.0.0.1:8000/api/sellers/profile/",
                        {
                            headers: {
                                Authorization: `Bearer ${authTokens.access}`,
                            },
                        }
                    );
                    setUserProfile(response.data);
                    setIsSeller(true);
                } catch (error) {
                    console.log("User is not a seller yet");
                    setIsSeller(false);
                }
            }
        };

        checkSellerStatus();
    }, [isAuthenticated, authTokens]);

    const handleLogout = () => {
        localStorage.removeItem("authTokens");
        setAuthTokens(null);
        setUserProfile(null);
        setIsSeller(false);
        navigate("/");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="bg-[#b21f3c] shadow-lg">
            <nav className="flex items-center justify-between w-full p-4">
                {/* Logo Section */}
                <div className="flex flex-row gap-4 items-center">
                    <img src={navDigiLogo} alt="دیجی‌کالا" className="w-10 h-10" />
                    <img src={navLogo} alt="دیجی‌کالا" className="w-26 h-10" />
                    <span className="text-white border border-white text-sm bg-opacity-20 px-2 py-1 rounded">
                        پنل فروشندگان
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {isAuthenticated ? (
                        isSeller ? (
                            <>
                                {/* Navigation Links */}
                                <div className="flex items-center gap-4">
                                    <Link 
                                        to="/seller-profile" 
                                        className="text-white hover:text-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        <FaChartBar size={16} />
                                        داشبورد
                                    </Link>
                                    <Link 
                                        to="/seller-profile/products" 
                                        className="text-white hover:text-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        <FaBox size={16} />
                                        محصولات
                                    </Link>
                                    <Link 
                                        to="/seller-orders" 
                                        className="text-white hover:text-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        <FaStore size={16} />
                                        سفارشات
                                    </Link>
                                </div>

                                {/* User Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                                    >
                                        <FaUser size={16} />
                                        <span className="text-sm">
                                            {userProfile?.store_name || "فروشنده"}
                                        </span>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                            <Link
                                                to="/seller-profile/info"
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <FaCog className="inline mr-2" />
                                                تنظیمات حساب
                                            </Link>
                                            <Link
                                                to="/seller-store-settings"
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <FaStore className="inline mr-2" />
                                                تنظیمات فروشگاه
                                            </Link>
                                            <hr className="my-2" />
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-right px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <FaSignOutAlt className="inline mr-2" />
                                                خروج از حساب
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/seller-register">
                                    <button className="bg-white text-[#b21f3c] font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        تبدیل به فروشنده
                                    </button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:text-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <FaSignOutAlt size={16} />
                                    خروج
                                </button>
                            </div>
                        )
                    ) : (
                        // User is not logged in
                        <Link to="/seller-register">
                            <button className="border border-white text-white font-semibold px-6 py-2 rounded-lg hover:bg-white hover:text-[#b21f3c] transition-colors cursor-pointer">
                                ثبت نام فروشندگان
                            </button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#a01d35] border-t border-red-600">
                    <div className="px-4 py-3 space-y-3">
                        {isAuthenticated ? (
                            isSeller ? (
                                <>
                                    <div className="text-white font-semibold border-b border-red-500 pb-2">
                                        {userProfile?.store_name || "فروشنده"}
                                    </div>
                                    <Link
                                        to="/seller-profile"
                                        className="block text-white hover:text-gray-200 transition-colors py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaChartBar className="inline mr-2" />
                                        داشبورد
                                    </Link>
                                    <Link
                                        to="/seller-products"
                                        className="block text-white hover:text-gray-200 transition-colors py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaBox className="inline mr-2" />
                                        محصولات
                                    </Link>
                                    <Link
                                        to="/seller-orders"
                                        className="block text-white hover:text-gray-200 transition-colors py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaStore className="inline mr-2" />
                                        سفارشات
                                    </Link>
                                    <Link
                                        to="/seller-profile"
                                        className="block text-white hover:text-gray-200 transition-colors py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaCog className="inline mr-2" />
                                        تنظیمات حساب
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-right text-red-300 hover:text-red-100 transition-colors py-2"
                                    >
                                        <FaSignOutAlt className="inline mr-2" />
                                        خروج از حساب
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/seller-register"
                                        className="block bg-white text-[#b21f3c] font-semibold px-4 py-2 rounded-lg text-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        تبدیل به فروشنده
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-right text-white hover:text-gray-200 transition-colors py-2"
                                    >
                                        <FaSignOutAlt className="inline mr-2" />
                                        خروج
                                    </button>
                                </>
                            )
                        ) : (
                            <Link
                                to="/seller-register"
                                className="block bg-white text-[#b21f3c] font-semibold px-4 py-2 rounded-lg text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                ثبت نام فروشندگان
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Click outside to close dropdown */}
            {(isDropdownOpen || isMobileMenuOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default SellerNavbar;