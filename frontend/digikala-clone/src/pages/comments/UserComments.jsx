
import { useContext,useState,useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { FaComment, FaRegStar } from "react-icons/fa";
import { FaBox } from "react-icons/fa"; 
import { FaStar } from "react-icons/fa";


const ProfileComments = () => {
  const { authTokens } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('waiting');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [activeTab]);

  const loadComments = () => {
    const mockComments = {
      waiting: [
        {
          id: 1,
          product: {
            id: 101,
            name: "گوشی موبایل سامسونگ Galaxy S23",
            image: null
          },
          rating: 4,
          title: "محصول خوبی است",
          text: "کیفیت ساخت عالی و دوربین فوق‌العاده. فقط قیمت کمی بالاست.",
          created_at: "2024-01-15",
          status: "waiting"
        }
      ],
      published: [
        {
          id: 2,
          product: {
            id: 102,
            name: "لپ تاپ ایسوس TUF Gaming",
            image: null
          },
          rating: 5,
          title: "عالی برای گیمینگ",
          text: "برای بازی‌های سنگین عملکرد خوبی دارد. سیستم خنک‌کننده قدرتمند.",
          created_at: "2024-01-10",
          status: "published",
          likes: 12,
          dislikes: 2
        }
      ],
      'not-approved': [
        {
          id: 3,
          product: {
            id: 103,
            name: "هدفون بی‌سیم سونی",
            image: null
          },
          rating: 2,
          title: "کیفیت پایین",
          text: "متاسفانه کیفیت ساخت ضعیف بود.",
          created_at: "2024-01-05",
          status: "rejected",
          rejection_reason: "استفاده از الفاظ نامناسب"
        }
      ]
    };

    setComments(mockComments[activeTab] || []);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      index < rating ? 
        <FaStar key={index} className="text-yellow-400" size={16} /> :
        <FaRegStar key={index} className="text-gray-300" size={16} />
    ));
  };

  const getStatusBadge = (status) => {
    const badges = {
      waiting: <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">در انتظار تایید</span>,
      published: <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">منتشر شده</span>,
      rejected: <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">تایید نشده</span>
    };
    return badges[status];
  };

  const tabs = [
    { id: 'waiting', label: 'در انتظار تایید', count: 1 },
    { id: 'published', label: 'منتشر شده', count: 1 },
    { id: 'not-approved', label: 'تایید نشده', count: 1 }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className=" p-6">
        <h1 className="text-2xl font-bold text-gray-800">دیدگاه‌های من</h1>
        <p className="text-gray-600 text-sm mt-1">مدیریت و مشاهده دیدگاه‌های ثبت شده</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="mr-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comments List */}
        <div className="p-6">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaComment className="mx-auto text-4xl mb-3 text-gray-300" />
              <p>دیدگاهی در این بخش وجود ندارد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      {comment.product.image ? (
                        <img
                          src={comment.product.image}
                          alt={comment.product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                          <FaBox className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-800 text-sm">
                            {comment.product.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">{renderStars(comment.rating)}</div>
                            <span className="text-xs text-gray-500">{comment.created_at}</span>
                          </div>
                        </div>
                        {getStatusBadge(comment.status)}
                      </div>

                      <h4 className="font-semibold text-gray-800 mb-1">{comment.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{comment.text}</p>

                      {comment.rejection_reason && (
                        <div className="bg-red-50 text-red-700 text-xs p-2 rounded mb-2">
                          <strong>دلیل عدم تایید:</strong> {comment.rejection_reason}
                        </div>
                      )}

                      {comment.status === 'published' && (
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>آیا این دیدگاه مفید بود؟</span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <FaRegStar className="text-green-500" />
                              {comment.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaRegStar className="text-red-500" />
                              {comment.dislikes}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfileComments;