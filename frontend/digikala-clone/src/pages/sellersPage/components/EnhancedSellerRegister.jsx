import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../auth/AuthContext";
import axios from "axios";
import { 
    FaUser, 
    FaStore, 
    FaIdCard, 
    FaCreditCard, 
    FaMapMarkerAlt,
    FaCheckCircle,
    FaExclamationTriangle
} from "react-icons/fa";

const EnhancedSellerRegister = () => {
    const { authTokens, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        is_legal: true,
        national_code: "",
        shaba_number: "",
        store_name: "",
        store_address: ""
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.national_code) {
            newErrors.national_code = "کد ملی الزامی است";
        } else if (formData.national_code.length !== 10) {
            newErrors.national_code = "کد ملی باید 10 رقم باشد";
        }
        
        if (!formData.shaba_number) {
            newErrors.shaba_number = "شماره شبا الزامی است";
        } else if (formData.shaba_number.replace(/[-\s]/g, '').length !== 24) {
            newErrors.shaba_number = "شماره شبا باید 24 رقم باشد";
        }
        
        if (!formData.store_name) {
            newErrors.store_name = "نام فروشگاه الزامی است";
        }
        
        if (!formData.store_address || formData.store_address.length < 10) {
            newErrors.store_address = "آدرس باید حداقل 10 کاراکتر باشد";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/sellers/register/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert("ثبت نام فروشنده با موفقیت انجام شد!");
            navigate("/seller-profile");
            
        } catch (error) {
            console.error("Seller registration error:", error);
            
            if (error.response?.status === 400) {
                const responseErrors = error.response.data;
                setErrors(responseErrors);
            } else if (error.response?.status === 403) {
                alert("شما قبلاً به عنوان فروشنده ثبت نام کرده‌اید");
                navigate("/seller-profile");
            } else if (error.response?.status === 401) {
                alert("جلسه شما منقضی شده. لطفاً دوباره وارد شوید");
                navigate("/users/login/");
            } else {
                alert("خطا در ثبت نام. لطفاً بعداً تلاش کنید.");
            }
        } finally {
            setLoading(false);
        }
    };

    const formatShabaNumber = (value) => {
        const digits = value.replace(/\D/g, '');
        const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1-');
        return formatted;
    };

    const handleShabaChange = (e) => {
        const formatted = formatShabaNumber(e.target.value);
        if (formatted.replace(/\D/g, '').length <= 24) {
            handleInputChange('shaba_number', formatted);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        برای ثبت نام فروشنده ابتدا وارد حساب کاربری خود شوید
                    </h2>
                    <button
                        onClick={() => navigate('/users/login/', { 
                            state: { returnTo: '/seller-register' } 
                        })}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        ورود به حساب کاربری
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="text-center">
                        <FaStore className="text-blue-500 text-4xl mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            ثبت نام فروشنده
                        </h1>
                        <p className="text-gray-600">
                            برای شروع فروش در پلتفرم، اطلاعات زیر را تکمیل کنید
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="space-y-6">
                        {/* Account Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                نوع حساب
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleInputChange('is_legal', true)}
                                    className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                                        formData.is_legal
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <FaUser className="mx-auto mb-2" />
                                    <div className="font-medium">حقوقی</div>
                                    <div className="text-xs text-gray-500">شرکت یا سازمان</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleInputChange('is_legal', false)}
                                    className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                                        !formData.is_legal
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <FaIdCard className="mx-auto mb-2" />
                                    <div className="font-medium">حقیقی</div>
                                    <div className="text-xs text-gray-500">شخص واقعی</div>
                                </button>
                            </div>
                        </div>

                        {/* National Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaIdCard className="inline ml-2" />
                                کد ملی *
                            </label>
                            <input
                                type="text"
                                value={formData.national_code}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 10) {
                                        handleInputChange('national_code', value);
                                    }
                                }}
                                maxLength={10}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                    errors.national_code
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                }`}
                                placeholder="کد ملی 10 رقمی"
                            />
                            {errors.national_code && (
                                <p className="text-red-500 text-sm mt-1">{errors.national_code}</p>
                            )}
                        </div>

                        {/* SHABA Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaCreditCard className="inline ml-2" />
                                شماره شبا *
                            </label>
                            <input
                                type="text"
                                value={formData.shaba_number}
                                onChange={handleShabaChange}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                    errors.shaba_number
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                }`}
                                placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XX"
                                dir="ltr"
                            />
                            {errors.shaba_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.shaba_number}</p>
                            )}
                        </div>

                        {/* Store Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaStore className="inline ml-2" />
                                نام فروشگاه *
                            </label>
                            <input
                                type="text"
                                value={formData.store_name}
                                onChange={(e) => handleInputChange('store_name', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                    errors.store_name
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                }`}
                                placeholder="نام فروشگاه یا شرکت"
                            />
                            {errors.store_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.store_name}</p>
                            )}
                        </div>

                        {/* Store Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaMapMarkerAlt className="inline ml-2" />
                                آدرس فروشگاه *
                            </label>
                            <textarea
                                rows={4}
                                value={formData.store_address}
                                onChange={(e) => handleInputChange('store_address', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                                    errors.store_address
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                }`}
                                placeholder="آدرس کامل فروشگاه یا محل کسب‌وکار"
                            />
                            {errors.store_address && (
                                <p className="text-red-500 text-sm mt-1">{errors.store_address}</p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                با ثبت نام، شرایط و قوانین پلتفرم را می‌پذیرید و متعهد به رعایت آن‌ها هستید.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/seller')}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                انصراف
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FaCheckCircle />
                                )}
                                {loading ? 'در حال ثبت...' : 'ثبت نام فروشنده'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedSellerRegister;