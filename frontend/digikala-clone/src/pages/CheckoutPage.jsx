import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaShoppingCart, FaUser, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';

const CheckoutPage = () => {
    const { items, totalItems, totalPrice, createOrder } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        shipping_name: '',
        shipping_phone: '',
        shipping_address: '',
        shipping_city: '',
        shipping_postal_code: '',
        payment_method: 'cash_on_delivery',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.shipping_name.trim()) {
            newErrors.shipping_name = 'نام و نام خانوادگی الزامی است';
        }

        if (!formData.shipping_phone.trim()) {
            newErrors.shipping_phone = 'شماره تلفن الزامی است';
        } else if (!/^09\d{9}$/.test(formData.shipping_phone)) {
            newErrors.shipping_phone = 'شماره تلفن معتبر نیست';
        }

        if (!formData.shipping_address.trim()) {
            newErrors.shipping_address = 'آدرس الزامی است';
        }

        if (!formData.shipping_city.trim()) {
            newErrors.shipping_city = 'شهر الزامی است';
        }

        if (!formData.shipping_postal_code.trim()) {
            newErrors.shipping_postal_code = 'کد پستی الزامی است';
        } else if (!/^\d{10}$/.test(formData.shipping_postal_code)) {
            newErrors.shipping_postal_code = 'کد پستی باید 10 رقم باشد';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const result = await createOrder(formData);
            
            if (result.success) {
                alert('سفارش شما با موفقیت ثبت شد!');
                navigate(`/order-success/${result.order.order_number}`);
            } else {
                alert(result.error || 'خطا در ثبت سفارش');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('خطا در ثبت سفارش');
        } finally {
            setLoading(false);
        }
    };

    const shippingCost = 50000;
    const taxAmount = totalPrice * 0.09;
    const finalTotal = totalPrice + shippingCost + taxAmount;

    if (!user) {
        navigate('/users/login');
        return null;
    }

    if (!items.length) {
        navigate('/cart');
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                        <FaShoppingCart className="text-blue-500" />
                        تکمیل خرید
                    </h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Shipping Information */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-blue-500" />
                                        اطلاعات ارسال
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نام و نام خانوادگی *
                                            </label>
                                            <input
                                                type="text"
                                                name="shipping_name"
                                                value={formData.shipping_name}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.shipping_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="نام و نام خانوادگی"
                                            />
                                            {errors.shipping_name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.shipping_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                شماره تلفن *
                                            </label>
                                            <input
                                                type="tel"
                                                name="shipping_phone"
                                                value={formData.shipping_phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.shipping_phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="09123456789"
                                            />
                                            {errors.shipping_phone && (
                                                <p className="text-red-500 text-sm mt-1">{errors.shipping_phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            آدرس کامل *
                                        </label>
                                        <textarea
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.shipping_address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="آدرس کامل"
                                        />
                                        {errors.shipping_address && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shipping_address}</p>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                شهر *
                                            </label>
                                            <input
                                                type="text"
                                                name="shipping_city"
                                                value={formData.shipping_city}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.shipping_city ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="تهران"
                                            />
                                            {errors.shipping_city && (
                                                <p className="text-red-500 text-sm mt-1">{errors.shipping_city}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                کد پستی *
                                            </label>
                                            <input
                                                type="text"
                                                name="shipping_postal_code"
                                                value={formData.shipping_postal_code}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.shipping_postal_code ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="1234567890"
                                                maxLength="10"
                                            />
                                            {errors.shipping_postal_code && (
                                                <p className="text-red-500 text-sm mt-1">{errors.shipping_postal_code}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <MdPayment className="text-blue-500" />
                                        روش پرداخت
                                    </h3>

                                    <div className="space-y-3">
                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-green-50 border-green-200">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cash_on_delivery"
                                                checked={formData.payment_method === 'cash_on_delivery'}
                                                onChange={handleInputChange}
                                                className="ml-3"
                                            />
                                            <div className="flex items-center gap-3">
                                                <FaCheckCircle className="text-green-500" />
                                                <div>
                                                    <div className="font-semibold">پرداخت در محل</div>
                                                    <div className="text-sm text-gray-600">پرداخت هنگام دریافت کالا</div>
                                                </div>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer opacity-50">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="online"
                                                disabled
                                                className="ml-3"
                                            />
                                            <div className="flex items-center gap-3">
                                                <MdPayment className="text-gray-400" />
                                                <div>
                                                    <div className="font-semibold text-gray-500">پرداخت آنلاین</div>
                                                    <div className="text-sm text-gray-400">فعلاً در دسترس نیست</div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        یادداشت سفارش
                                    </h3>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="یادداشت خاصی برای سفارش خود دارید؟ (اختیاری)"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    خلاصه سفارش
                                </h3>

                                {/* Order Items Summary */}
                                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-12 h-12 flex-shrink-0">
                                                {item.product.main_image ? (
                                                    <img
                                                        src={item.product.main_image}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-contain rounded"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                        <FaShoppingCart className="text-gray-400 text-sm" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-800 truncate">
                                                    {item.product.name}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {item.quantity} عدد × {formatPrice(item.product.price)} تومان
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-800">
                                                {formatPrice(item.total_price)} تومان
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Totals */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">جمع اقلام ({totalItems} عدد):</span>
                                        <span className="font-semibold">{formatPrice(totalPrice)} تومان</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">هزینه ارسال:</span>
                                        <span className="font-semibold">{formatPrice(shippingCost)} تومان</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">مالیات (9%):</span>
                                        <span className="font-semibold">{formatPrice(taxAmount)} تومان</span>
                                    </div>
                                    
                                    <hr className="border-gray-200" />
                                    
                                    <div className="flex justify-between text-lg font-bold text-gray-800">
                                        <span>مبلغ نهایی:</span>
                                        <span className="text-red-500">{formatPrice(finalTotal)} تومان</span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-green-500 hover:bg-green-600'
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            در حال ثبت سفارش...
                                        </>
                                    ) : (
                                        <>
                                            <FaShoppingCart />
                                            خرید
                                        </>
                                    )}
                                </button>

                                {/* Security Note */}
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 text-center">
                                    اطلاعات شما محفوظ و امن است
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckoutPage;