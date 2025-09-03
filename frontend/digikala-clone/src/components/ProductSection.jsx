import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import axios from 'axios';
import ProductCard from './ProductComponent';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const ProductsSection = ({ title = "محصولات جدید", category = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = 'http://127.0.0.1:8000/api/products/public/list/';
      if (category) {
        url += `?category=${category}`;
      }

      const response = await axios.get(url);
      
      const shuffled = response.data.sort(() => Math.random() - 0.5);
      setProducts(shuffled);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('خطا در بارگذاری محصولات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-4"></div>
                <div className="bg-gray-200 h-8 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
          <div className="text-center text-gray-500 py-12">
            <p>محصولی برای نمایش وجود ندارد</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm">
            مشاهده همه
            <FaAngleLeft />
          </button>
        </div>

        {/* Products Carousel for Mobile/Tablet */}
        <div className="block lg:hidden">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              480: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="relative"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
            
            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md">
              <FaAngleRight className="w-5 h-5 text-gray-600" />
            </button>
            <button className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md">
              <FaAngleLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Swiper>
        </div>

        {/* Products Grid for Desktop */}
        <div className="hidden lg:grid grid-cols-5 gap-4">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;