import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  MdLaptop, 
  MdPhone, 
  MdWatch, 
  MdHeadphones,
  MdTv,
  MdVideogameAsset,
  MdKitchen,
  MdChair
} from 'react-icons/md';
import { FaShoppingBag } from 'react-icons/fa';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryIcons = {
    'لپ تاپ': <MdLaptop className="w-8 h-8" />,
    'موبایل': <MdPhone className="w-8 h-8" />,
    'ساعت هوشمند': <MdWatch className="w-8 h-8" />,
    'هدفون': <MdHeadphones className="w-8 h-8" />,
    'تلویزیون': <MdTv className="w-8 h-8" />,
    'گیمینگ': <MdVideogameAsset className="w-8 h-8" />,
    'لوازم خانگی': <MdKitchen className="w-8 h-8" />,
    'مبلمان': <MdChair className="w-8 h-8" />,
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/categories/public/');
      setCategories(response.data.slice(0, 8)); // Get first 8 categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([
        { id: 1, name: 'لپ تاپ', en_name: 'laptop' },
        { id: 2, name: 'موبایل', en_name: 'mobile' },
        { id: 3, name: 'ساعت هوشمند', en_name: 'smartwatch' },
        { id: 4, name: 'هدفون', en_name: 'headphone' },
        { id: 5, name: 'تلویزیون', en_name: 'tv' },
        { id: 6, name: 'گیمینگ', en_name: 'gaming' },
        { id: 7, name: 'لوازم خانگی', en_name: 'home' },
        { id: 8, name: 'مبلمان', en_name: 'furniture' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">دسته‌بندی‌ها</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg p-4 h-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">خرید بر اساس دسته‌بندی</h2>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.en_name || category.id}`}
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="text-gray-600 group-hover:text-blue-500 transition-colors mb-2">
                {categoryIcons[category.name] || <FaShoppingBag className="w-8 h-8" />}
              </div>
              <span className="text-xs text-center text-gray-700 group-hover:text-gray-900">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;