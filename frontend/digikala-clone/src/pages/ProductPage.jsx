import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LiaStoreAltSolid } from "react-icons/lia";
import { MdAddShoppingCart } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaRegHeart, FaStar } from "react-icons/fa";
import ProductCard from "../components/ProductSection";
import deliveryGrayIcon from "../assets/cash-on-delivery-gray.svg";
import returnGrayIcon from "../assets/days-return-gray.svg";
import expressGrayIcon from "../assets/express-delivery-gray.svg";
import originalGrayIcon from "../assets/original-products-gray.svg";
import supportGrayIcon from "../assets/support-gray.svg";

export function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const { addToCart } = useCart();

    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('features');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    useEffect(() => {
        if (showOverlay) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [showOverlay]);

    const fetchProductDetail = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/products/public/${id}/`
            );
            setProduct(response.data);
            setSelectedImage(response.data.images?.[0]?.url || null);
            setRelatedProducts(response.data.related_products || []);
        } catch (error) {
            console.error("Error fetching product:", error);
            if (error.response?.status === 404) {
                alert("محصول یافت نشد");
                navigate("/");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowOverlay(true);
    };

    const handleAddToCart = async () => {
        if (!user) {
            alert('برای افزودن به سبد خرید باید وارد حساب کاربری خود شوید');
            navigate('/users/login');
            return;
        }
        
        if (product.stock === 0) {
            alert('این محصول ناموجود است');
            return;
        }

        if (quantity > product.stock) {
            alert(`حداکثر موجودی: ${product.stock} عدد`);
            return;
        }

        if (!addToCart) {
            alert('خطا در اتصال به سبد خرید');
            return;
        }

        setAddingToCart(true);
        try {
            const success = await addToCart(product.id, quantity);
            if (success) {
                alert(`${quantity} عدد ${product.name} به سبد خرید اضافه شد`);
                setQuantity(1);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('خطا در افزودن به سبد خرید');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleAddToWishlist = () => {
        if (!user) {
            alert('برای افزودن به علاقه‌مندی‌ها باید وارد حساب کاربری خود شوید');
            navigate('/users/login');
            return;
        }
        
        // TODO: Implement wishlist functionality
        alert('محصول به لیست علاقه‌مندی‌ها اضافه شد');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

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

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="text-center py-20">
                    <p>محصولی یافت نشد</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <a href="/" className="hover:text-blue-600">خانه</a>
                    <span>/</span>
                    <span>{product.category_name}</span>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[90%] mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Image Gallery - 5 columns */}
                        <div className="lg:col-span-5">
                            {/* Main Image */}
                            <div className="mb-4 bg-gray-50 rounded-lg p-8 cursor-pointer" 
                                 onClick={() => handleImageClick(selectedImage)}>
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="w-full h-96 object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-96 flex items-center justify-center text-gray-400">
                                        <span>بدون تصویر</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {product.images && product.images.length > 1 && (
    <div className="grid grid-cols-5 gap-2">
        {product.images.map((img, index) => (
            <div
                key={`product-image-${index}-${img.id || img.url}`}
                className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${
                    selectedImage === img.url 
                        ? "border-blue-500" 
                        : "border-gray-200 hover:border-gray-400"
                }`}
                onClick={() => setSelectedImage(img.url)}
            >
                <img
                    src={img.url}
                    alt={img.alt_text || product.name}
                    className="w-full h-20 object-contain"
                />
            </div>
        ))}
    </div>
)}
                        </div>

                        {/* Product Info - 4 columns */}
                        <div className="lg:col-span-4">
                            {/* Product Name */}
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                                {product.name}
                            </h1>

                            {/* Rating and Reviews */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
        <FaStar key={`rating-star-${i}`} className="w-4 h-4 text-yellow-400" /> // Fixed key
    ))}
    <span className="text-sm text-gray-600 mr-2">4.5 از 5</span>
</div>
                                <span className="text-sm text-gray-500">|</span>
                                <span className="text-sm text-blue-600 cursor-pointer">
                                    123 دیدگاه کاربران
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 mb-6 leading-relaxed text-justify text-sm">
                                {product.description || "توضیحات محصول در دسترس نیست"}
                            </p>

                           {/* Features */}
{product.attributes && Object.keys(product.attributes).length > 0 && (
    <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">ویژگی‌های کلیدی:</h3>
        <ul className="space-y-2">
            {Object.entries(product.attributes).slice(0, 4).map(([key, value], index) => {
                // اگر value یک آبجکت باشه، تبدیلش می‌کنیم به رشته
                let displayValue;
                if (typeof value === "object" && value !== null) {
                    displayValue = Object.entries(value)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ");
                } else {
                    displayValue = value;
                }

                return (
                    <li
                        key={`feature-${key}-${index}`}
                        className="flex items-start gap-2"
                    >
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-sm text-gray-600">
                            <strong>{key}:</strong> {displayValue}
                        </span>
                    </li>
                );
            })}
        </ul>
    </div>
)}

                            
                        </div>

                        {/* Purchase Box - 3 columns */}
                        <div className="lg:col-span-3">
                            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                                {/* Seller Info */}
                                <div className="pb-4 mb-4 border-b">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">فروشنده:</p>
                                            <div className="flex items-center gap-2">
                                                <LiaStoreAltSolid className="w-5 h-5 text-gray-600" />
                                                <p className="font-semibold">{product.seller_info?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-green-600">عملکرد عالی</p>
                                            <p className="text-xs text-gray-500">
                                                {product.seller_info?.products_count} کالا
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                        <span className="text-sm font-normal text-gray-600 mr-2">تومان</span>
                                    </p>
                                </div>

                                {/* Stock Status */}
                                <div className="mb-4">
                                    {product.stock > 0 ? (
                                        <p className="text-green-600 text-sm">
                                            موجود در انبار ({product.stock} عدد)
                                        </p>
                                    ) : (
                                        <p className="text-red-600 text-sm">ناموجود</p>
                                    )}
                                </div>

                                {/* Quantity Selector */}
                                {product.stock > 0 && (
                                    <div className="mb-4">
                                        <label className="block text-sm text-gray-600 mb-2">تعداد:</label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-8 h-8 rounded border hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                                className="w-16 text-center border rounded"
                                            />
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                className="w-8 h-8 rounded border hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons - UPDATE THE ADD TO CART BUTTON */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0 || addingToCart}
                                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                            product.stock > 0
                                                ? user
                                                    ? addingToCart
                                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                                        : 'bg-red-500 text-white hover:bg-red-600'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {addingToCart ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                در حال افزودن...
                                            </>
                                        ) : (
                                            <>
                                                <MdAddShoppingCart className="w-5 h-5" />
                                                {product.stock === 0 
                                                    ? 'ناموجود' 
                                                    : user 
                                                        ? 'افزودن به سبد خرید'
                                                        : 'ورود برای خرید'
                                                }
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={handleAddToWishlist}
                                        className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaRegHeart className="w-4 h-4" />
                                        افزودن به علاقه‌مندی‌ها
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Warranty and Shipping */}
                    <div className="flex justify-between gap-4 my-6 p-4 text-gray-400 font-medium text-sm mx-auto border-t-1 border-b-4 border-gray-300">
                        <div className="flex items-center gap-1">
                            <img src={supportGrayIcon} className="w-11" alt="" />
                            <span className="">24 ساعته ، 7 روز هفته</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <img src={deliveryGrayIcon} className="w-11" alt="" />
                            <span className="">امکان پرداخت درب محل</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <img src={expressGrayIcon} className="w-11" alt="" />
                            <span className="">امکان تحویل اکسپرس</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <img src={returnGrayIcon} className="w-11" alt="" />
                            <span className="">7 روز ضمانت بازگشت</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <img src={originalGrayIcon} className="w-11" alt="" />
                            <span className="">ضمانت اصالت کالا</span>
                        </div>
                    </div>
                    {/* Tabs Section */}
                    <div className="mt-12  pt-8">
                        <div className="flex gap-8 border-b mb-6 border-gray-100">
                            <button
                                onClick={() => setActiveTab('features')}
                                className={`pb-4 px-2 ${activeTab === 'features' ? 'font-medium border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'} cursor-pointer`}
                            >
                                مشخصات فنی
                            </button>
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`pb-4 px-2 ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'} cursor-pointer`}
                            >
                                معرفی محصول
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-4 px-2 ${activeTab === 'reviews' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'} cursor-pointer`}
                            >
                                دیدگاه‌ها
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'features' && product.attributes && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(product.attributes).map(([key, value], index) => {
            let displayValue;
            if (typeof value === "object" && value !== null) {
                displayValue = Object.entries(value)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ");
            } else {
                displayValue = value;
            }

            return (
                <div
                    key={`spec-${key}-${index}`}
                    className="flex border-b border-gray-200 pb-3"
                >
                    <span className="text-gray-600 w-1/3">{key}:</span>
                    <span className="text-gray-800 font-medium w-2/3">
                        {displayValue}
                    </span>
                </div>
            );
        })}
    </div>
)}

                        {activeTab === 'description' && (
                            <div className="prose max-w-none  border-gray-200">
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description || "توضیحات تکمیلی برای این محصول در دسترس نیست."}
                                </p>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-center py-12 text-gray-500">
                                <p>هنوز دیدگاهی برای این محصول ثبت نشده است</p>
                                {user && (
                                    <button className="mt-4 text-blue-600 hover:underline">
                                        اولین نفری باشید که دیدگاه می‌نویسید
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
    <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">محصولات مرتبط</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                    key={`related-${relatedProduct.id}`}
                    product={relatedProduct} 
                />
            ))}
        </div>
    </div>
)}
                </div>
            </div>




            {/* Image Overlay */}
            {showOverlay && (
                <div className="fixed inset-0 w-full h-full bg-black bg-opacity-90 z-50">
                    <button 
                        className="text-white absolute top-4 right-4 hover:cursor-pointer z-50"
                        onClick={() => setShowOverlay(false)}
                    >
                        <IoClose className="text-white w-12 h-12"/>
                    </button>
                    <div className="w-full h-full flex justify-center items-center">
                        <img 
                            src={selectedImage} 
                            alt={product.name} 
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}