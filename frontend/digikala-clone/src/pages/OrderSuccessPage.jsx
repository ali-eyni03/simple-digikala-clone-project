import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCheckCircle, FaShoppingCart, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';
import axios from 'axios';

const OrderSuccessPage = () => {
    const { orderNumber } = useParams();
    const { authTokens, user } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/users/login');
            return;
        }
        fetchOrderDetails();
    }, [orderNumber, user]);

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/orders/orders/by-number/${orderNumber}/`,
                {
                    headers: {
                        Authorization: `Bearer ${authTokens?.access}`,
                    },
                }
            );
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order:', error);
            setTimeout(() => navigate('/profile/orders'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fa-IR');
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
                <Footer />
            </>
        );
    }

    if (!order) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-8 text-center">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                        سفارش یافت نشد
                    </h2>
                    <p className="text-gray-500 mb-6">
                        در حال انتقال به صفحه سفارشات...
                    </p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                سفارش شما با موفقیت ثبت شد!
                            </h1>
                            <p className="text-gray-600 mb-4">
                                شماره سفارش شما: <span className="font-semibold text-blue-600">{order.order_number}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                تاریخ ثبت: {formatDate(order.created_at)}
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Order Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Items */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaShoppingCart className="text-blue-500" />
                                    اقلام سفارش
                                </h3>
                                
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-16 h-16 flex-shrink-0">
                                                {item.product.main_image ? (
                                                    <img
                                                        src={item.product.main_image}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-contain rounded"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                        <FaShoppingCart className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800">
                                                    {item.product.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {item.quantity} عدد × {formatPrice(item.price)} تومان
                                                </p>
                                            </div>
                                            
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800">
                                                    {formatPrice(item.total)} تومان
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-blue-500" />
                                    اطلاعات ارسال
                                </h3>
                                
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">نام گیرنده:</span>
                                        <span className="font-semibold mr-2">{order.shipping_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">تلفن:</span>
                                        <span className="font-semibold mr-2">{order.shipping_phone}</span>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="text-gray-600">آدرس:</span>
                                        <span className="font-semibold mr-2">
                                            {order.shipping_address}, {order.shipping_city}, {order.shipping_postal_code}
                                        </span>
                                    </div>
                                    {order.notes && (
                                        <div className="md:col-span-2">
                                            <span className="text-gray-600">یادداشت:</span>
                                            <span className="mr-2">{order.notes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Delivery Information */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <MdLocalShipping className="text-blue-500" />
                                    اطلاعات ارسال
                                </h3>
                                
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="font-semibold text-blue-800">ارسال با پست پیشتاز</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-1">
                                        زمان تقریبی ارسال: 2-3 روز کاری
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        پرداخت: {order.payment_method === 'cash_on_delivery' ? 'در محل' : 'آنلاین'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    خلاصه سفارش
                                </h3>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">جمع کالاها:</span>
                                        <span className="font-semibold">{formatPrice(order.subtotal)} تومان</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">هزینه ارسال:</span>
                                        <span className="font-semibold">{formatPrice(order.shipping_cost)} تومان</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">مالیات:</span>
                                        <span className="font-semibold">{formatPrice(order.tax_amount)} تومان</span>
                                    </div>
                                    
                                    <hr className="border-gray-200" />
                                    
                                    <div className="flex justify-between text-lg font-bold text-gray-800">
                                        <span>مبلغ کل:</span>
                                        <span className="text-red-500">{formatPrice(order.total_amount)} تومان</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Link 
                                        to="/profile/orders"
                                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaUser />
                                        مشاهده سفارشات من
                                    </Link>
                                    
                                    <Link 
                                        to="/"
                                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center block"
                                    >
                                        ادامه خرید
                                    </Link>
                                </div>

                                {/* Success Message */}
                                <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
                                    <p className="text-green-700 text-sm">
                                        سفارش شما با موفقیت ثبت شد و به زودی آماده ارسال خواهد شد
                                    </p>
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

export default OrderSuccessPage;