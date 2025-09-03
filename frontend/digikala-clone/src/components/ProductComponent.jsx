import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { user } = useContext(AuthContext);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const calculateDiscount = (originalPrice, discountPrice) => {
    if (!discountPrice || discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const discount = product.discount_price ? 
    calculateDiscount(product.price, product.discount_price) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      alert('برای افزودن به سبد خرید باید وارد حساب کاربری خود شوید');
      return;
    }
    // TODO: Implement add to cart functionality
    alert('محصول به سبد خرید اضافه شد');
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square bg-gray-50 p-4">
          {product.main_image ? (
            <img
              src={product.main_image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span>بدون تصویر</span>
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
            {formatPrice(discount)}٪
          </div>
        )}

        {/* Quick Actions - Show on hover */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement wishlist functionality
            }}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <FaRegHeart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category_name && (
          <p className="text-xs text-blue-600 mb-2">{product.category_name}</p>
        )}

        {/* Product Name */}
        <h3 className="font-medium text-gray-800 mb-3 line-clamp-2 min-h-[48px]">
          {product.name}
        </h3>

        {/* Seller Info */}
        {product.seller_name && (
          <p className="text-xs text-gray-500 mb-3">
            فروشنده: {product.seller_name}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-end justify-between mb-3">
          <div>
            {product.discount_price && discount > 0 ? (
              <>
                <p className="text-gray-400 line-through text-sm">
                  {formatPrice(product.price)}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(product.discount_price)}
                  <span className="text-sm font-normal mr-1">تومان</span>
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
                <span className="text-sm font-normal mr-1">تومان</span>
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <span className="text-xs text-green-600">موجود</span>
            ) : (
              <span className="text-xs text-red-600">ناموجود</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${
            product.stock > 0
              ? user
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <MdAddShoppingCart className="w-5 h-5" />
          {product.stock === 0 
            ? 'ناموجود' 
            : user 
              ? 'افزودن به سبد خرید'
              : 'ورود برای خرید'
          }
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;