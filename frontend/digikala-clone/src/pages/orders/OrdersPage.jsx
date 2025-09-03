import React, { useState, useEffect, useContext } from "react";
import { 
  FaShoppingCart, FaBox, FaTruck, FaCheckCircle, FaTimesCircle,
  FaClock, FaMoneyBillWave, FaReceipt, FaChevronDown, FaChevronUp,
  FaShippingFast, FaUndo, FaFileInvoice, FaMapMarkerAlt,
  FaBell, FaEnvelope, FaEnvelopeOpen, FaTrash, FaFilter,
  FaInfoCircle, FaExclamationTriangle, FaGift, FaPercentage,
  FaStar, FaHeart, FaCommentDots, FaCreditCard, FaWallet,
  FaSearch, FaCalendar, FaDownload, FaEye, FaPrint
} from "react-icons/fa";
import { 
  MdNotifications, MdNotificationsActive, MdNotificationsOff,
  MdMarkEmailRead, MdDeleteSweep, MdSettings, MdLocalShipping,
  MdAssignment, MdPayment, MdCancel, MdLoop, MdDone,
  MdPending, MdLocalOffer, MdNewReleases, MdSystemUpdate
} from "react-icons/md";

const AuthContext = React.createContext({
  authTokens: { access: "demo-token" },
  user: { id: 1, phone: "09123456789" }
});

const OrdersPage = () => {
  const { authTokens } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [activeTab, dateFilter]);

  const loadOrders = () => {
    const mockOrders = [
      {
        id: "ORD-20240125-001",
        order_number: "۱۴۰۲۱۲۳۴۵",
        status: "delivered",
        created_at: "2024-01-25",
        delivered_at: "2024-01-28",
        total_amount: 45500000,
        discount_amount: 2500000,
        shipping_cost: 50000,
        payment_method: "online",
        payment_status: "paid",
        tracking_code: "POST123456789",
        address: {
          recipient: "علی احمدی",
          phone: "09123456789",
          address: "تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۱۲",
          postal_code: "1234567890"
        },
        items: [
          {
            id: 1,
            product: {
              id: 101,
              name: "گوشی موبایل سامسونگ Galaxy S23",
              image: null,
              seller: "دیجی استور"
            },
            quantity: 1,
            price: 38000000,
            discount: 2000000,
            status: "delivered"
          },
          {
            id: 2,
            product: {
              id: 102,
              name: "قاب گوشی سامسونگ",
              image: null,
              seller: "موبایل پلاس"
            },
            quantity: 2,
            price: 250000,
            discount: 0,
            status: "delivered"
          }
        ],
        timeline: [
          { date: "2024-01-25 10:30", status: "pending", title: "ثبت سفارش" },
          { date: "2024-01-25 14:45", status: "confirmed", title: "تایید سفارش" },
          { date: "2024-01-26 09:00", status: "processing", title: "آماده‌سازی سفارش" },
          { date: "2024-01-27 11:30", status: "shipped", title: "ارسال از انبار" },
          { date: "2024-01-28 16:20", status: "delivered", title: "تحویل به مشتری" }
        ]
      },
      {
        id: "ORD-20240120-002",
        order_number: "۱۴۰۲۱۲۳۴۴",
        status: "processing",
        created_at: "2024-01-20",
        total_amount: 12500000,
        discount_amount: 500000,
        shipping_cost: 0,
        payment_method: "cash_on_delivery",
        payment_status: "pending",
        tracking_code: null,
        address: {
          recipient: "علی احمدی",
          phone: "09123456789",
          address: "تهران، میدان آرژانتین، برج آسمان",
          postal_code: "9876543210"
        },
        items: [
          {
            id: 3,
            product: {
              id: 103,
              name: "لپ تاپ ایسوس TUF Gaming",
              image: null,
              seller: "تکنولایف"
            },
            quantity: 1,
            price: 12500000,
            discount: 500000,
            status: "processing"
          }
        ],
        timeline: [
          { date: "2024-01-20 12:00", status: "pending", title: "ثبت سفارش" },
          { date: "2024-01-20 15:30", status: "confirmed", title: "تایید سفارش" },
          { date: "2024-01-21 10:00", status: "processing", title: "در حال آماده‌سازی" }
        ]
      },
      {
        id: "ORD-20240115-003",
        order_number: "۱۴۰۲۱۲۳۴۳",
        status: "cancelled",
        created_at: "2024-01-15",
        cancelled_at: "2024-01-16",
        cancellation_reason: "عدم موجودی کالا",
        total_amount: 2500000,
        discount_amount: 0,
        shipping_cost: 35000,
        payment_method: "online",
        payment_status: "refunded",
        refund_amount: 2535000,
        address: {
          recipient: "علی احمدی",
          phone: "09123456789",
          address: "تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۱۲",
          postal_code: "1234567890"
        },
        items: [
          {
            id: 4,
            product: {
              id: 104,
              name: "هدفون بی‌سیم سونی WH-1000XM5",
              image: null,
              seller: "صوتی تصویری احمدی"
            },
            quantity: 1,
            price: 2500000,
            discount: 0,
            status: "cancelled"
          }
        ],
        timeline: [
          { date: "2024-01-15 09:00", status: "pending", title: "ثبت سفارش" },
          { date: "2024-01-15 11:00", status: "confirmed", title: "تایید سفارش" },
          { date: "2024-01-16 10:30", status: "cancelled", title: "لغو سفارش - عدم موجودی" }
        ]
      },
      {
        id: "ORD-20240110-004",
        order_number: "۱۴۰۲۱۲۳۴۲",
        status: "returned",
        created_at: "2024-01-10",
        delivered_at: "2024-01-13",
        returned_at: "2024-01-18",
        return_reason: "مغایرت با کالای سفارش داده شده",
        total_amount: 850000,
        discount_amount: 50000,
        shipping_cost: 25000,
        payment_method: "online",
        payment_status: "refunded",
        refund_amount: 875000,
        address: {
          recipient: "علی احمدی",
          phone: "09123456789",
          address: "تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۱۲",
          postal_code: "1234567890"
        },
        items: [
          {
            id: 5,
            product: {
              id: 105,
              name: "کیبورد مکانیکال ردراگون",
              image: null,
              seller: "گیمینگ شاپ"
            },
            quantity: 1,
            price: 850000,
            discount: 50000,
            status: "returned"
          }
        ],
        timeline: [
          { date: "2024-01-10 14:00", status: "pending", title: "ثبت سفارش" },
          { date: "2024-01-10 16:00", status: "confirmed", title: "تایید سفارش" },
          { date: "2024-01-11 10:00", status: "processing", title: "آماده‌سازی" },
          { date: "2024-01-12 09:00", status: "shipped", title: "ارسال" },
          { date: "2024-01-13 15:00", status: "delivered", title: "تحویل" },
          { date: "2024-01-15 11:00", status: "return_requested", title: "درخواست مرجوعی" },
          { date: "2024-01-16 10:00", status: "return_approved", title: "تایید مرجوعی" },
          { date: "2024-01-17 14:00", status: "return_pickup", title: "دریافت کالا" },
          { date: "2024-01-18 12:00", status: "returned", title: "مرجوعی کامل شد" }
        ]
      }
    ];

    let filtered = mockOrders;
    if (activeTab !== 'all') {
      const statusMap = {
        'pending': ['pending', 'confirmed', 'processing'],
        'delivered': ['delivered'],
        'cancelled': ['cancelled'],
        'returned': ['returned']
      };
      filtered = filtered.filter(order => 
        statusMap[activeTab]?.includes(order.status) || false
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch(dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'three-months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(order => 
        new Date(order.created_at) >= filterDate
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_number.includes(searchQuery) ||
        order.items.some(item => 
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setOrders(filtered);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'در انتظار تایید', color: 'yellow', icon: <MdPending /> },
      'confirmed': { label: 'تایید شده', color: 'blue', icon: <MdDone /> },
      'processing': { label: 'در حال پردازش', color: 'blue', icon: <MdLoop /> },
      'shipped': { label: 'ارسال شده', color: 'indigo', icon: <FaTruck /> },
      'delivered': { label: 'تحویل شده', color: 'green', icon: <FaCheckCircle /> },
      'cancelled': { label: 'لغو شده', color: 'red', icon: <MdCancel /> },
      'returned': { label: 'مرجوع شده', color: 'gray', icon: <FaUndo /> },
      'return_requested': { label: 'درخواست مرجوعی', color: 'orange', icon: <FaUndo /> },
      'return_approved': { label: 'مرجوعی تایید شده', color: 'orange', icon: <FaCheckCircle /> },
      'return_pickup': { label: 'در انتظار دریافت', color: 'orange', icon: <FaTruck /> }
    };
    return statusMap[status] || { label: status, color: 'gray', icon: <FaBox /> };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fa-IR');
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('آیا از لغو این سفارش اطمینان دارید؟')) {
      // API call to cancel order
      alert('سفارش با موفقیت لغو شد');
      loadOrders();
    }
  };

  const handleReturnRequest = async (orderId) => {
    alert('به صفحه درخواست مرجوعی منتقل می‌شوید');
  };

  const handleReorder = async (order) => {
    alert('محصولات به سبد خرید اضافه شدند');
  };

  const handleDownloadInvoice = (orderId) => {
    alert('فاکتور در حال دانلود...');
  };

  const tabs = [
    { id: 'all', label: 'همه سفارش‌ها', icon: <FaBox /> },
    { id: 'pending', label: 'در حال پردازش', icon: <MdPending /> },
    { id: 'delivered', label: 'تحویل شده', icon: <FaCheckCircle /> },
    { id: 'cancelled', label: 'لغو شده', icon: <MdCancel /> },
    { id: 'returned', label: 'مرجوع شده', icon: <FaUndo /> }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className=" p-6">
        <h1 className="text-2xl font-bold text-gray-600 flex items-center gap-2">
          <FaShoppingCart />
          سفارش‌های من
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          تاریخچه و وضعیت سفارشات شما
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو با شماره سفارش یا نام محصول..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:border-2 focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">همه زمان‌ها</option>
            <option value="week">هفته گذشته</option>
            <option value="month">ماه گذشته</option>
            <option value="three-months">سه ماه گذشته</option>
            <option value="year">سال گذشته</option>
          </select>
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
                className={`px-4 md:px-6 py-3 font-medium text-sm border-b-2 border-gray-300 transition-colors whitespace-nowrap flex items-center gap-2 ${
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

        {/* Orders List */}
        <div className="p-4 ">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaShoppingCart className="mx-auto text-4xl mb-3 text-gray-300" />
              <p>سفارشی یافت نشد</p>
              <button className="mt-4 text-blue-600 hover:underline text-sm">
                شروع خرید
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-gray-300">
              {orders.map(order => {
                const statusInfo = getStatusInfo(order.status);
                const isExpanded = expandedOrder === order.id;

                return (
                  <div key={order.id} className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* Order Header */}
                    <div 
                      className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`text-${statusInfo.color}-500 text-2xl`}>
                            {statusInfo.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1 b">
                              <span className="font-semibold">شماره سفارش:</span>
                              <span className="font-mono">{order.order_number}</span>
                              <span className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-700 text-xs px-2 py-0.5 rounded`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span>{formatDate(order.created_at)}</span>
                              <span className="mx-2">•</span>
                              <span>{order.items.length} محصول</span>
                              <span className="mx-2">•</span>
                              <span className="font-medium">
                                {formatPrice(order.total_amount)} تومان
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {order.tracking_code && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setShowTrackingModal(true);
                              }}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                              title="پیگیری مرسوله"
                            >
                              <MdLocalShipping size={20} />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadInvoice(order.id);
                            }}
                            className="text-gray-600 hover:bg-gray-100 p-2 rounded"
                            title="دانلود فاکتور"
                          >
                            <FaDownload size={16} />
                          </button>
                          <div className="text-gray-400">
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Details (Expanded) */}
                    {isExpanded && (
                      <div className="border-t border-gray-300">
                        {/* Products */}
                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold text-gray-800 mb-3">محصولات سفارش</h3>
                          {order.items.map(item => (
                            <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                              <div className="w-16 h-16 flex-shrink-0">
                                {item.product.image ? (
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                    <FaBox className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{item.product.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  فروشنده: {item.product.seller}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sm text-gray-500">
                                    {item.quantity} عدد
                                  </span>
                                  <div className="text-left">
                                    {item.discount > 0 && (
                                      <p className="text-xs text-gray-400 line-through">
                                        {formatPrice(item.price + item.discount)}
                                      </p>
                                    )}
                                    <p className="font-medium">
                                      {formatPrice(item.price * item.quantity)} تومان
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary */}
                        <div className="p-4 bg-gray-50 space-y-2">
                          <div className="flex justify-between text-sm ">
                            <span className="text-gray-600">جمع کل محصولات:</span>
                            <span>{formatPrice(order.total_amount + order.discount_amount - order.shipping_cost)} تومان</span>
                          </div>
                          {order.discount_amount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">تخفیف:</span>
                              <span className="text-red-500">-{formatPrice(order.discount_amount)} تومان</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm ">
                            <span className="text-gray-600">هزینه ارسال:</span>
                            <span>{order.shipping_cost > 0 ? `${formatPrice(order.shipping_cost)} تومان` : 'رایگان'}</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-2 border-t border-gray-300">
                            <span>مبلغ نهایی:</span>
                            <span className="text-lg">{formatPrice(order.total_amount)} تومان</span>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="p-4 border-t border-gray-400">
                          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gray-500" />
                            آدرس تحویل
                          </h3>
                          <div className="bg-gray-50 p-3 rounded-lg text-sm">
                            <p className="font-medium">{order.address.recipient}</p>
                            <p className="text-gray-600 mt-1">{order.address.address}</p>
                            <div className="flex gap-4 mt-2 text-gray-500">
                              <span>کدپستی: {order.address.postal_code}</span>
                              <span>تلفن: {order.address.phone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="p-4 border-t border-gray-300">
                          <h3 className="font-semibold text-gray-800 mb-3">وضعیت سفارش</h3>
                          <div className="space-y-3">
                            {order.timeline.map((event, index) => (
                              <div key={index} className="flex gap-3">
                                <div className="relative">
                                  <div className={`w-3 h-3 rounded-full ${
                                    index === 0 ? 'bg-green-500' : 'bg-gray-300'
                                  }`}></div>
                                  {index < order.timeline.length - 1 && (
                                    <div className="absolute top-3 right-1/2 transform translate-x-1/2 w-0.5 h-8 bg-gray-300"></div>
                                  )}
                                </div>
                                <div className="flex-1 -mt-1">
                                  <p className="font-medium text-sm">{event.title}</p>
                                  <p className="text-xs text-gray-500">{event.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t bg-gray-50">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowInvoiceModal(true);
                              }}
                              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
                            >
                              <FaFileInvoice />
                              مشاهده فاکتور
                            </button>
                            
                            {order.status === 'processing' && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 text-sm flex items-center gap-2"
                              >
                                <MdCancel />
                                لغو سفارش
                              </button>
                            )}
                            
                            {order.status === 'delivered' && (
                              <button
                                onClick={() => handleReturnRequest(order.id)}
                                className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 text-sm flex items-center gap-2"
                              >
                                <FaUndo />
                                درخواست مرجوعی
                              </button>
                            )}
                            
                            {(order.status === 'delivered' || order.status === 'cancelled') && (
                              <button
                                onClick={() => handleReorder(order)}
                                className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 text-sm flex items-center gap-2"
                              >
                                <FaShoppingCart />
                                خرید مجدد
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Cancellation/Return Info */}
                        {order.status === 'cancelled' && (
                          <div className="p-4 bg-red-50 border-t border-red-200">
                            <p className="text-sm text-red-700">
                              <strong>دلیل لغو:</strong> {order.cancellation_reason}
                            </p>
                            {order.refund_amount && (
                              <p className="text-sm text-red-700 mt-1">
                                <strong>مبلغ بازگشتی:</strong> {formatPrice(order.refund_amount)} تومان
                              </p>
                            )}
                          </div>
                        )}
                        
                        {order.status === 'returned' && (
                          <div className="p-4 bg-orange-50 border-t border-orange-200">
                            <p className="text-sm text-orange-700">
                              <strong>دلیل مرجوعی:</strong> {order.return_reason}
                            </p>
                            <p className="text-sm text-orange-700 mt-1">
                              <strong>تاریخ مرجوعی:</strong> {formatDate(order.returned_at)}
                            </p>
                            {order.refund_amount && (
                              <p className="text-sm text-orange-700 mt-1">
                                <strong>مبلغ بازگشتی:</strong> {formatPrice(order.refund_amount)} تومان
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-300 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">فاکتور سفارش</h2>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Invoice Header */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold">فاکتور فروش</h3>
                <p className="text-sm text-gray-600 mt-1">شماره فاکتور: {selectedOrder.order_number}</p>
                <p className="text-sm text-gray-600">تاریخ: {formatDate(selectedOrder.created_at)}</p>
              </div>

              {/* Customer Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">مشخصات خریدار</h4>
                <div className="text-sm space-y-1">
                  <p>نام: {selectedOrder.address.recipient}</p>
                  <p>تلفن: {selectedOrder.address.phone}</p>
                  <p>آدرس: {selectedOrder.address.address}</p>
                  <p>کدپستی: {selectedOrder.address.postal_code}</p>
                </div>
              </div>

              {/* Products Table */}
              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-right text-sm">محصول</th>
                    <th className="border border-gray-300 p-2 text-center text-sm">تعداد</th>
                    <th className="border border-gray-300 p-2 text-right text-sm">قیمت واحد</th>
                    <th className="border border-gray-300 p-2 text-right text-sm">جمع</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 text-sm">{item.product.name}</td>
                      <td className="border border-gray-300 p-2 text-center text-sm">{item.quantity}</td>
                      <td className="border border-gray-300 p-2 text-right text-sm">{formatPrice(item.price)}</td>
                      <td className="border border-gray-300 p-2 text-right text-sm">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>جمع کل:</span>
                  <span>{formatPrice(selectedOrder.total_amount + selectedOrder.discount_amount - selectedOrder.shipping_cost)}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>تخفیف:</span>
                    <span>-{formatPrice(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>هزینه ارسال:</span>
                  <span>{selectedOrder.shipping_cost > 0 ? formatPrice(selectedOrder.shipping_cost) : 'رایگان'}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-300">
                  <span>مبلغ نهایی:</span>
                  <span>{formatPrice(selectedOrder.total_amount)} تومان</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <FaPrint />
                  چاپ فاکتور
                </button>
                <button
                  onClick={() => handleDownloadInvoice(selectedOrder.id)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <FaDownload />
                  دانلود PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="border-b border-gray-300 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">پیگیری مرسوله</h2>
              <button 
                onClick={() => setShowTrackingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 text-center">
              <MdLocalShipping className="mx-auto text-blue-500 text-5xl mb-4" />
              <p className="text-sm text-gray-600 mb-2">کد رهگیری پستی:</p>
              <p className="text-lg font-mono font-bold mb-4">{selectedOrder.tracking_code}</p>
              <p className="text-xs text-gray-500 mb-4">
                برای پیگیری مرسوله خود می‌توانید از سایت پست استفاده کنید
              </p>
              <a
                href={`https://tracking.post.ir/search.aspx?id=${selectedOrder.tracking_code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                پیگیری در سایت پست
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;