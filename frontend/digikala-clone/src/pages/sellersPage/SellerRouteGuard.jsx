import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import axios from "axios";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

const SellerRouteGuard = ({ children }) => {
    const { authTokens, isAuthenticated } = useContext(AuthContext);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isSeller, setIsSeller] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkSellerStatus = async () => {
            if (!isAuthenticated || !authTokens) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/sellers/status/",
                    {
                        headers: {
                            Authorization: `Bearer ${authTokens.access}`,
                        },
                    }
                );

                setIsSeller(response.data.is_seller);
            } catch (error) {
                console.error("Error checking seller status:", error);
                setError("خطا در بررسی وضعیت فروشنده");
                setIsSeller(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkSellerStatus();
    }, [isAuthenticated, authTokens]);
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="text-blue-500 text-4xl mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">در حال بررسی دسترسی...</p>
                </div>
            </div>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!isSeller) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        دسترسی محدود
                    </h2>
                    <p className="text-gray-600 mb-6">
                        برای دسترسی به این بخش، ابتدا باید به عنوان فروشنده ثبت نام کنید.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            بازگشت
                        </button>
                        <a
                            href="/seller-register"
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-center"
                        >
                            ثبت نام فروشنده
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-4">خطا</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        تلاش مجدد
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default SellerRouteGuard;