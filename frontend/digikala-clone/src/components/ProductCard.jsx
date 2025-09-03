import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useCart } from '../context/CartContext';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const calculateDiscount = (originalPrice, discountPrice) => {
    if (!discountPrice || discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const discount = product.discount_price ? 
    calculateDiscount(product.price, product.discount_price) : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault(); 
    
    if (!user) {
      alert('برای افزودن به سبد خرید باید وارد حساب کاربری خود شوید');
      return;
    }

    if (product.stock === 0) {
      alert('این محصول ناموجود است');
      return;
    }

    const success = await addToCart(product.id, 1);
    if (success) {
      alert('محصول به سبد خرید اضافه شد');
    }
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
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <MdAddShoppingCart className="w-16 h-16 text-gray-300" />
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            {discount}% تخفیف
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Implement wishlist functionality
          }}
        >
          <FaRegHeart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.discount_price || product.price)}
              <span className="text-xs font-normal mr-1">تومان</span>
            </span>
            {product.discount_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-3">
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
    </Link>
  );
};

export default ProductCard;

