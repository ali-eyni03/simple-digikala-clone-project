
import { useContext,useState,useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaBox } from "react-icons/fa";

const ProfileLists = () => {
  const { authTokens } = useContext(AuthContext);
  const [activeList, setActiveList] = useState('favorites'); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, [activeList]);

  const loadProducts = () => {
    // Mock data - replace with API call
    const mockProducts = {
      favorites: [
        {
          id: 1,
          name: "گوشی موبایل شیائومی Redmi Note 12 Pro",
          price: 12500000,
          original_price: 13500000,
          image: null,
          in_stock: true,
          discount_percent: 7
        },
        {
          id: 2,
          name: "ساعت هوشمند اپل واچ سری 9",
          price: 18500000,
          original_price: 19000000,
          image: null,
          in_stock: false,
          discount_percent: 3
        }
      ],
      'next-buy': [
        {
          id: 3,
          name: "هدفون بی‌سیم JBL",
          price: 2500000,
          original_price: null,
          image: null,
          in_stock: true,
          discount_percent: 0
        }
      ],
      notifications: [
        {
          id: 4,
          name: "لپ تاپ لنوو ThinkPad",
          price: 35000000,
          original_price: 38000000,
          image: null,
          in_stock: true,
          discount_percent: 8,
          notification_type: 'price_drop'
        }
      ]
    };

    setProducts(mockProducts[activeList] || []);
  };

  const handleRemoveFromList = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const lists = [
    { id: 'favorites', label: 'علاقه‌مندی‌ها', icon: <FaHeart className="text-red-500" /> },
    { id: 'next-buy', label: 'خرید بعدی', icon: <FaShoppingCart className="text-green-500" /> },
    { id: 'notifications', label: 'اطلاع‌رسانی', icon: <FaExclamationTriangle className="text-yellow-500" /> }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className=" p-6">
        <h1 className="text-2xl font-bold text-gray-800">لیست‌های من</h1>
        <p className="text-gray-600 text-sm mt-1">مدیریت محصولات مورد علاقه و لیست خرید</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="space-y-2 flex justify-between">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => setActiveList(list.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeList === list.id
                      ? 'bg-gray-100 text-blue-600 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  } cursor-pointer`}
                >
                  {list.icon}
                  <span className="font-medium">{list.label}</span>
                  <span className="mr-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {products.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در لیست..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none  focus:border-1 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Products */}
            <div className="p-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaHeart className="mx-auto text-4xl mb-3 text-gray-300" />
                  <p>محصولی در این لیست وجود ندارد</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 relative group">
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromList(product.id)}
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-lg rounded-full p-1.5 hover:bg-red-50"
                      >
                        <FaTimes className="text-red-500" size={14} />
                      </button>

                      {/* Discount Badge */}
                      {product.discount_percent > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {product.discount_percent}%
                        </div>
                      )}

                      {/* Product Image */}
                      <div className="aspect-square mb-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <FaBox className="text-gray-400 text-3xl" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Stock Status */}
                      {!product.in_stock && (
                        <p className="text-xs text-red-500 mb-2">ناموجود</p>
                      )}

                      {/* Notification Type */}
                      {product.notification_type === 'price_drop' && (
                        <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-2">
                          کاهش قیمت
                        </div>
                      )}

                      {/* Price */}
                      <div className="mt-auto">
                        {product.original_price && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(product.original_price)}
                          </p>
                        )}
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                          <span className="text-xs font-normal mr-1">تومان</span>
                        </p>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        disabled={!product.in_stock}
                        className={`w-full mt-3 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                          product.in_stock
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FaShoppingCart />
                        {product.in_stock ? 'افزودن به سبد' : 'ناموجود'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLists;