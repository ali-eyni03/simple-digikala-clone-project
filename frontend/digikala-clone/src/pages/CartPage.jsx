// pages/CartPage.jsx - Updated with proper discount handling
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { MdDelete, MdShoppingCart } from 'react-icons/md';

const CartPage = () => {
    const { items, totalItems, totalPrice, loading, updateCartItem, removeFromCart, clearCart, fetchCart } = useCart();
    const { user } = useContext(AuthContext);
    const [updatingItems, setUpdatingItems] = useState(new Set());
    const [removing, setRemoving] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const getEffectivePrice = (product) => {
        return product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;
    };

    const getDiscountPercentage = (product) => {
        if (!product.discount_price || product.discount_price >= product.price) return 0;
        return Math.round(((product.price - product.discount_price) / product.price) * 100);
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setUpdatingItems(prev => new Set(prev).add(itemId));
        try {
            const success = await updateCartItem(itemId, newQuantity);
            if (!success) {
            }
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
            setRemoving(prev => new Set(prev).add(itemId));
            try {
                await removeFromCart(itemId);
            } finally {
                setRemoving(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(itemId);
                    return newSet;
                });
            }
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('آیا از پاک کردن کل سبد خرید اطمینان دارید؟')) {
            await clearCart();
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const shippingCost = 50000;
    const taxAmount = totalPrice * 0.09;
    const finalTotal = totalPrice + shippingCost + taxAmount;

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-8 text-center min-h-screen">
                    <div className="max-w-md mx-auto">
                        <MdShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                            برای مشاهده سبد خرید باید وارد شوید
                        </h2>
                        <Link 
                            to="/users/login" 
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
                        >
                            ورود به حساب کاربری
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">در حال بارگذاری سبد خرید...</p>
                    </div>
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
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <FaShoppingCart className="text-2xl text-blue-500" />
                            <h1 className="text-2xl font-bold text-gray-800">
                                سبد خرید
                            </h1>
                            {totalItems > 0 && (
                                <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                                    {totalItems} کالا
                                </span>
                            )}
                        </div>
                        
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            <span>بازگشت به فروشگاه</span>
                            <FaArrowRight />
                        </Link>
                    </div>

                    {/* Cart Content */}
                    {items.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="bg-white rounded-lg shadow-md p-12 max-w-md mx-auto">
                                <MdShoppingCart className="text-8xl text-gray-200 mx-auto mb-6" />
                                <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                                    سبد خرید شما خالی است
                                </h2>
                                <p className="text-gray-500 mb-6">
                                    می‌توانید برای مشاهده محصولات بیشتر به صفحات زیر مراجعه کنید
                                </p>
                                <Link 
                                    to="/" 
                                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                                >
                                    <FaShoppingCart />
                                    صفحه اصلی دیجی‌کالا
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-4 gap-8">
                            {/* Cart Items List */}
                            <div className="lg:col-span-3">
                                {/* Clear Cart Button */}
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-600">
                                        {totalItems} کالا در سبد خرید شما
                                    </span>
                                    <button
                                        onClick={handleClearCart}
                                        className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm transition-colors cursor-pointer"
                                    >
                                        <MdDelete />
                                        حذف همه کالاها
                                    </button>
                                </div>

                                {/* Cart Items */}
                                <div className="space-y-4">
                                    {items.map((item) => {
                                        const effectivePrice = getEffectivePrice(item.product);
                                        const discountPercentage = getDiscountPercentage(item.product);
                                        const hasDiscount = discountPercentage > 0;

                                        return (
                                            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                                                <div className="flex items-start gap-4">
                                                    {/* Product Image */}
                                                    <div className="w-24 h-24 flex-shrink-0">
                                                        {item.product.main_image ? (
                                                            <img
                                                                src={item.product.main_image}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-contain rounded-lg border"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border">
                                                                <FaShoppingCart className="text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <Link 
                                                            to={`/product/${item.product.id}`}
                                                            className="text-lg font-semibold text-gray-800 hover:text-blue-500 transition-colors line-clamp-2"
                                                        >
                                                            {item.product.name}
                                                        </Link>
                                                        
                                                        <div className="mt-2 space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-600">قیمت واحد:</span>
                                                                <div className="text-right">
                                                                    <span className="font-semibold text-gray-800">
                                                                        {formatPrice(effectivePrice)} تومان
                                                                    </span>
                                                                    {hasDiscount && (
                                                                        <div className="flex items-center gap-2 justify-end">
                                                                            <span className="text-xs text-gray-400 line-through">
                                                                                {formatPrice(item.product.price)}
                                                                            </span>
                                                                            <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                                                                                {discountPercentage}%
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-600">موجودی:</span>
                                                                <span className="text-xs text-green-600">
                                                                    {item.product.stock} عدد
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Quantity and Actions */}
                                                    <div className="flex flex-col items-end gap-4">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-3 border rounded-lg p-1">
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <FaMinus className="text-xs" />
                                                            </button>
                                                            
                                                            <span className="w-12 text-center font-semibold">
                                                                {updatingItems.has(item.id) ? '...' : item.quantity}
                                                            </span>
                                                            
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                disabled={item.quantity >= item.product.stock || updatingItems.has(item.id)}
                                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <FaPlus className="text-xs" />
                                                            </button>
                                                        </div>

                                                        {/* Item Total */}
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-red-500">
                                                                {formatPrice(item.total_price)} تومان
                                                            </div>
                                                            {hasDiscount && (
                                                                <div className="text-xs text-gray-400 line-through">
                                                                    {formatPrice(item.product.price * item.quantity)} تومان
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            disabled={removing.has(item.id)}
                                                            className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {removing.has(item.id) ? (
                                                                <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-red-500"></div>
                                                            ) : (
                                                                <FaTrash />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        خلاصه سبد خرید
                                    </h3>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">قیمت کالاها ({totalItems}):</span>
                                            <span className="font-semibold">{formatPrice(totalPrice)} تومان</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">هزینه ارسال:</span>
                                            <span className="font-semibold">{formatPrice(shippingCost)} تومان</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">مالیات بر ارزش افزوده:</span>
                                            <span className="font-semibold">{formatPrice(taxAmount)} تومان</span>
                                        </div>
                                        
                                        <hr className="border-gray-200" />
                                        
                                        <div className="flex justify-between text-lg font-bold text-gray-800">
                                            <span>جمع سبد خرید:</span>
                                            <span className="text-red-500">{formatPrice(finalTotal)} تومان</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <FaShoppingCart />
                                        ادامه فرآیند خرید
                                    </button>
                                    
                                    <Link 
                                        to="/"
                                        className="block text-center text-blue-500 hover:text-blue-600 mt-4 transition-colors"
                                    >
                                        بازگشت به فروشگاه
                                    </Link>

                                    {/* Additional Info */}
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <span>🚚</span>
                                            <span>ارسال رایگان برای خرید بالای 500 هزار تومان</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <span>🔒</span>
                                            <span>پرداخت امن و محافظت از اطلاعات شخصی</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span>↩️</span>
                                            <span>7 روز ضمانت بازگشت کالا</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CartPage;