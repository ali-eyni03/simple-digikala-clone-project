import { useContext,useState,useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { FaComment, FaRegStar } from "react-icons/fa";
import { FaBox } from "react-icons/fa"; 
import { FaStar } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { FaPercentage } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { MdNotificationsOff } from "react-icons/md";
import { FaTruck } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { FaGift } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";


const UserNotifications = () => {
  const { authTokens } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all'); 
  const [notifications, setNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    push: true,
    orderUpdates: true,
    promotions: true,
    productUpdates: true,
    systemNews: true
  });

  useEffect(() => {
    loadNotifications();
  }, [activeTab, filterType]);

  const loadNotifications = () => {
    const mockNotifications = [
      {
        id: 1,
        type: 'order',
        title: 'سفارش شما ارسال شد',
        message: 'سفارش با شماره ۱۴۰۲۱۲۳۴۵ از انبار ارسال شد و تا ۲ روز آینده به دست شما خواهد رسید.',
        created_at: '2024-01-28 14:30',
        is_read: false,
        icon: <FaTruck className="text-blue-500" />,
        action_url: '/orders/ORD-20240125-001',
        priority: 'high',
        metadata: {
          order_id: 'ORD-20240125-001',
          tracking_code: 'POST123456789'
        }
      },
      {
        id: 2,
        type: 'promotion',
        title: 'تخفیف ویژه عید',
        message: 'از تخفیف ۲۰٪ روی تمام محصولات دیجیتال استفاده کنید. کد تخفیف: EID1403',
        created_at: '2024-01-27 10:00',
        is_read: true,
        icon: <FaPercentage className="text-green-500" />,
        action_url: '/promotions',
        priority: 'medium',
        expires_at: '2024-02-10',
        metadata: {
          discount_code: 'EID1403',
          discount_percent: 20
        }
      },
      {
        id: 3,
        type: 'product',
        title: 'محصول مورد نظر موجود شد',
        message: 'گوشی Samsung Galaxy S24 که در لیست انتظار شما بود، اکنون موجود است.',
        created_at: '2024-01-26 16:45',
        is_read: false,
        icon: <FaBox className="text-purple-500" />,
        action_url: '/product/samsung-s24',
        priority: 'medium',
        metadata: {
          product_id: 106,
          product_name: 'Samsung Galaxy S24',
          price: 45000000
        }
      },
      {
        id: 4,
        type: 'system',
        title: 'بروزرسانی قوانین و مقررات',
        message: 'قوانین حریم خصوصی سایت بروزرسانی شد. لطفا مطالعه فرمایید.',
        created_at: '2024-01-25 09:00',
        is_read: true,
        icon: <FaInfoCircle className="text-gray-500" />,
        action_url: '/terms',
        priority: 'low'
      },
      {
        id: 5,
        type: 'order',
        title: 'سفارش شما تحویل داده شد',
        message: 'سفارش ۱۴۰۲۱۲۳۴۴ با موفقیت تحویل داده شد. از خرید شما متشکریم.',
        created_at: '2024-01-24 18:20',
        is_read: true,
        icon: <FaCheckCircle className="text-green-500" />,
        action_url: '/orders/ORD-20240120-002',
        priority: 'medium',
        metadata: {
          order_id: 'ORD-20240120-002',
          has_review_request: true
        }
      },
      {
        id: 6,
        type: 'product',
        title: 'کاهش قیمت محصول',
        message: 'قیمت "لپ تاپ ASUS TUF Gaming" که در لیست علاقه‌مندی شماست ۱۰٪ کاهش یافت.',
        created_at: '2024-01-23 12:00',
        is_read: false,
        icon: <FaHeart className="text-red-500" />,
        action_url: '/product/asus-tuf',
        priority: 'medium',
        metadata: {
          product_id: 103,
          old_price: 13500000,
          new_price: 12150000
        }
      },
      {
        id: 7,
        type: 'system',
        title: 'احراز هویت موفق',
        message: 'حساب کاربری شما با موفقیت احراز هویت شد. اکنون می‌توانید از امکان خرید اعتباری استفاده کنید.',
        created_at: '2024-01-22 15:30',
        is_read: true,
        icon: <MdVerified className="text-blue-500" />,
        action_url: '/profile',
        priority: 'high'
      },
      {
        id: 8,
        type: 'promotion',
        title: 'کد تخفیف اختصاصی',
        message: 'کد تخفیف ۱۵٪ اختصاصی برای شما: USER15OFF. اعتبار تا ۳ روز دیگر.',
        created_at: '2024-01-21 11:00',
        is_read: false,
        icon: <FaGift className="text-orange-500" />,
        action_url: '/cart',
        priority: 'high',
        expires_at: '2024-01-31',
        metadata: {
          discount_code: 'USER15OFF',
          discount_percent: 15,
          min_purchase: 500000
        }
      }
    ];

    let filtered = mockNotifications;
    
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.is_read);
    } else if (activeTab !== 'all') {
      filtered = filtered.filter(n => n.type === activeTab);
    }

    if (searchQuery) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

    setNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationIds) => {
    setNotifications(prev => prev.map(n =>
      notificationIds.includes(n.id) ? { ...n, is_read: true } : n
    ));
    setSelectedNotifications([]);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleDelete = async (notificationIds) => {
    if (window.confirm(`آیا از حذف ${notificationIds.length} اعلان اطمینان دارید؟`)) {
      setNotifications(prev => prev.filter(n => !notificationIds.includes(n.id)));
      setSelectedNotifications([]);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('آیا از حذف همه اعلان‌ها اطمینان دارید؟')) {
      setNotifications([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const handleSaveSettings = async () => {
    alert('تنظیمات با موفقیت ذخیره شد');
    setShowSettings(false);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'همین الان';
    if (diffMins < 60) return `${diffMins} دقیقه پیش`;
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    if (diffDays < 7) return `${diffDays} روز پیش`;
    return d.toLocaleDateString('fa-IR');
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'order': <FaShoppingCart className="text-blue-500" />,
      'product': <FaBox className="text-purple-500" />,
      'promotion': <FaPercentage className="text-green-500" />,
      'system': <FaInfoCircle className="text-gray-500" />
    };
    return icons[type] || <FaBell className="text-gray-500" />;
  };

  const tabs = [
    { id: 'all', label: 'همه', icon: <MdNotifications /> },
    { id: 'unread', label: 'خوانده نشده', icon: <MdNotificationsActive /> },
    { id: 'order', label: 'سفارشات', icon: <FaShoppingCart /> },
    { id: 'product', label: 'محصولات', icon: <FaBox /> },
    { id: 'promotion', label: 'تخفیف‌ها', icon: <FaPercentage /> },
    { id: 'system', label: 'سیستمی', icon: <FaInfoCircle /> }
  ];

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaBell />
              اعلان‌ها
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              آخرین اعلان‌ها و پیام‌های سیستمی
            </p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg"
            title="تنظیمات اعلان"
          >
            <MdSettings size={24} />
          </button>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در اعلان‌ها..."
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            {selectedNotifications.length > 0 && (
              <>
                <button
                  onClick={() => handleMarkAsRead(selectedNotifications)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm flex items-center gap-2"
                >
                  <MdMarkEmailRead />
                  خواندن ({selectedNotifications.length})
                </button>
                <button
                  onClick={() => handleDelete(selectedNotifications)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm flex items-center gap-2"
                >
                  <FaTrash />
                  حذف ({selectedNotifications.length})
                </button>
              </>
            )}
            
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              خواندن همه
            </button>
            
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              {selectedNotifications.length === notifications.length ? 'لغو انتخاب' : 'انتخاب همه'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b overflow-x-auto">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MdNotificationsOff className="mx-auto text-4xl mb-3 text-gray-300" />
              <p>اعلانی وجود ندارد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-400' : ''}`}
                  onClick={() => handleToggleSelect(notification.id)}
                >
                  <div className="flex gap-4">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleSelect(notification.id);
                        }}
                        className="rounded"
                      />
                    </div>

                    {/* Icon */}
                    <div className="text-2xl flex-shrink-0">
                      {notification.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          
                          {/* Metadata */}
                          {notification.metadata && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {notification.metadata.discount_code && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                                  کد: {notification.metadata.discount_code}
                                </span>
                              )}
                              {notification.metadata.tracking_code && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                  رهگیری: {notification.metadata.tracking_code}
                                </span>
                              )}
                              {notification.expires_at && (
                                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                                  انقضا: {formatDate(notification.expires_at)}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.created_at)}
                            </span>
                            {notification.action_url && (
                              <a
                                href={notification.action_url}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                مشاهده جزئیات ←
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">تنظیمات اعلان</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-800 mb-3">روش‌های دریافت اعلان</h3>
              
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">اعلان از طریق ایمیل</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.email}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    email: e.target.checked
                  })}
                  className="rounded"
                />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">پیامک</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.sms}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    sms: e.target.checked
                  })}
                  className="rounded"
                />
              </label>  
  <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">اعلان‌های پوش (Push)</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.push}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    push: e.target.checked
                  })}
                  className="rounded"
                />
              </label>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-3">نوع اعلان‌ها</h3>
                
                <label className="flex items-center justify-between cursor-pointer mb-3">
                  <span className="text-sm">بروزرسانی سفارشات</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.orderUpdates}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      orderUpdates: e.target.checked
                    })}
                    className="rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer mb-3">
                  <span className="text-sm">تخفیف‌ها و پیشنهادات ویژه</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.promotions}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      promotions: e.target.checked
                    })}
                    className="rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer mb-3">
                  <span className="text-sm">موجود شدن محصولات</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.productUpdates}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      productUpdates: e.target.checked
                    })}
                    className="rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">اخبار و اطلاعیه‌های سیستم</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.systemNews}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      systemNews: e.target.checked
                    })}
                    className="rounded"
                  />
                </label>
              </div>
            </div>
            
            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ذخیره تنظیمات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {notifications.filter(n => !n.is_read).length}
            </div>
            <div className="text-sm text-gray-600">خوانده نشده</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter(n => n.type === 'order').length}
            </div>
            <div className="text-sm text-gray-600">سفارشات</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {notifications.filter(n => n.type === 'promotion').length}
            </div>
            <div className="text-sm text-gray-600">تخفیف‌ها</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {notifications.length}
            </div>
            <div className="text-sm text-gray-600">کل اعلان‌ها</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
