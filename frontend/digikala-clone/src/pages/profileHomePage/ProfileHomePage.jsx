import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import axios from "axios";
import { FaAngleLeft, FaUser, FaShoppingCart, FaHeart, FaBox } from "react-icons/fa";
import { MdVerified, MdWarning } from "react-icons/md";
import { RiShoppingCartLine } from "react-icons/ri";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import statusReturned from "../../assets/status-returned.svg";
import statusDelivered from "../../assets/status-delivered.svg";
import statusProcessing from "../../assets/status-processing.svg";

const ProductCard = ({ product, type = "wishlist" }) => {
	const formatPrice = (price) => {
		return new Intl.NumberFormat('fa-IR').format(price);
	};

	return (
		<Link
			to={`/product/${product.id}`}
			className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 flex flex-col h-full"
		>
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
			
			<div className="flex-1 flex flex-col">
				<p className="text-sm text-gray-700 mb-2 line-clamp-2">
					{product.name}
				</p>
				
				<div className="mt-auto">
					{product.price && (
						<div className="mb-3">
							<p className="text-lg font-bold text-gray-900">
								{formatPrice(product.price)}
								<span className="text-xs font-normal mr-1">تومان</span>
							</p>
							{product.original_price && product.original_price > product.price && (
								<p className="text-xs text-gray-400 line-through">
									{formatPrice(product.original_price)}
								</p>
							)}
						</div>
					)}
					
					<button 
						className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
							type === "wishlist" 
								? "border border-red-500 text-red-500 hover:bg-red-50"
								: "border border-blue-500 text-blue-500 hover:bg-blue-50"
						}`}
						onClick={(e) => {
							e.preventDefault();
							// Handle add to cart
						}}
					>
						<RiShoppingCartLine />
						افزودن به سبد خرید
					</button>
				</div>
			</div>
		</Link>
	);
};

const StatsCard = ({ icon, count, label, color }) => (
	<div className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer">
		<img src={icon} alt={label} className="w-12 h-12" />
		<div>
			<p className="text-2xl font-bold text-gray-800">{count}</p>
			<p className="text-sm text-gray-600">{label}</p>
		</div>
	</div>
);

const UserProfileHomePage = () => {
	const { authTokens, user } = useContext(AuthContext);
	const [userProfile, setUserProfile] = useState(null);
	const [wishlistProducts, setWishlistProducts] = useState([]);
	const [recentlyViewed, setRecentlyViewed] = useState([]);
	const [orderStats, setOrderStats] = useState({
		processing: 0,
		delivered: 0,
		returned: 0
	});
	const [loading, setLoading] = useState(true);
	const [isVerified, setIsVerified] = useState(false);

	useEffect(() => {
		fetchUserData();
	}, [authTokens]);

	const fetchUserData = async () => {
		if (!authTokens) return;

		try {
			setLoading(true);
			
			const profileResponse = await axios.get(
				"http://127.0.0.1:8000/api/accounts/profile/",
				{
					headers: {
						Authorization: `Bearer ${authTokens?.access}`,
					},
				}
			);
			setUserProfile(profileResponse.data);
			
			const { first_name, last_name, national_id, email } = profileResponse.data;
			setIsVerified(!!(first_name && last_name && national_id && email));
			
			setWishlistProducts([
				{
					id: 1,
					name: "لپ تاپ 15.6 اینچی ایسوس مدل TUF Gaming F15",
					price: 45999000,
					original_price: 48999000,
					image: "https://dkstatics-public.digikala.com/digikala-products/3ef95f8e1c9e99c029b7f8911907a1849c9a9752_1749279092.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80"
				},
				{
					id: 2,
					name: "گوشی موبایل سامسونگ مدل Galaxy S23",
					price: 38500000,
					original_price: 42000000,
					image: null
				},
			]);
			
			setRecentlyViewed([
				{
					id: 3,
					name: "ساعت هوشمند اپل واچ سری 9",
					price: 18500000,
					image: null
				},
			]);
			setOrderStats({
				processing: 2,
				delivered: 5,
				returned: 1
			});
			
		} catch (error) {
			console.error("Error fetching user data:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-4 space-y-4 m-2">
			{/* Welcome Section */}
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold mb-2">
							سلام {userProfile?.first_name || 'کاربر عزیز'}
						</h1>
						<p className="opacity-90">
							به حساب کاربری خود خوش آمدید
						</p>
					</div>
					<FaUser className="text-4xl opacity-50" />
				</div>
			</div>

			{/* Identity Verification Alert */}
			{!isVerified && (
				<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<MdWarning className="text-amber-600 text-xl" />
							<div className="text-sm">
								<p className="font-medium text-amber-900">تکمیل اطلاعات حساب کاربری</p>
								<p className="text-amber-700 mt-1">
									با تایید هویت می‌توانید امنیت حساب کاربری‌تان را افزایش دهید و از امکان «خرید اعتباری» نیز استفاده کنید
								</p>
							</div>
						</div>
						<Link
							to="/profile/personal-info"
							className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap"
						>
							تایید هویت
							<FaAngleLeft />
						</Link>
					</div>
				</div>
			)}

			
			{/* Orders Section */}
			<div className="bg-white rounded-lg shadow-sm ">
				<div className="flex items-center justify-between p-4 border-b border-gray-200">
					<h2 className="text-lg font-bold flex items-center gap-2 text-gray-500">
						<FaShoppingCart  />
						سفارش‌های من
					</h2>
					<Link
						to="/profile/orders"
						className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
					>
						مشاهده همه
						<FaAngleLeft />
					</Link>
				</div>
				
				<div className="p-6">
					{orderStats.processing > 0 || orderStats.delivered > 0 ? (
						<div className="grid grid-cols-3 gap-4">
							<Link to="/profile/orders?status=processing" className="text-center p-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
								<div>
									<img src={statusProcessing} className="w-16" alt="" />
								</div>
								<div className="flex flex-col items-start p-1">
									<div className="text-xl font-bold text-blue-500">{orderStats.processing}</div>
								<p className="text-sm text-gray-600 mt-1">در حال پردازش</p>
								</div>
							</Link>
							<Link to="/profile/orders?status=delivered" className="text-center p-4 rounded-lg hover:bg-gray-100 transition-colors  flex items-center justify-center gap-2">
								<div>
									<img src={statusDelivered} className="w-16" alt="" />
								</div>
								<div className="flex flex-col items-start p-1">
									<div className="text-xl font-bold text-green-500">{orderStats.delivered}</div>
									<p className="text-sm text-gray-600 mt-1">تحویل شده</p>
								</div>
							</Link>
							<Link to="/profile/orders?status=returned" className="text-center p-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
								<div>
									<img src={statusReturned} className="w-16" alt="" />
								</div>
								<div className="flex flex-col items-start p-1">
									<div className="text-xl font-bold text-yellow-500">{orderStats.returned}</div>
									<p className="text-sm text-gray-600 mt-1">مرجوع شده</p>
								</div>
							</Link>
						</div>
					) : (
						<div className="text-center py-8 text-gray-500">
							<FaShoppingCart className="text-4xl mx-auto mb-3 text-gray-300" />
							<p>شما هنوز سفارشی ثبت نکرده‌اید</p>
							<Link to="/" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
								شروع خرید
							</Link>
						</div>
					)}
				</div>
			</div>

			{/* Wishlist Section */}
			{wishlistProducts.length > 0 && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-100">
					<div className="flex items-center justify-between p-4 border-b border-gray-200">
						<h2 className="text-lg font-bold flex items-center gap-2">
							<FaHeart className="text-red-500" />
							از لیست‌های شما
						</h2>
						<Link
							to="/profile/lists"
							className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
						>
							مشاهده همه
							<FaAngleLeft />
						</Link>
					</div>
					
					<div className="p-4">
						<Swiper
							modules={[Pagination, Navigation]}
							spaceBetween={16}
							navigation
							pagination={{ clickable: true }}
							breakpoints={{
								320: { slidesPerView: 1 },
								640: { slidesPerView: 2 },
								768: { slidesPerView: 3 },
								1024: { slidesPerView: 4 },
							}}
						>
							{wishlistProducts.map((product) => (
								<SwiperSlide key={product.id}>
									<ProductCard product={product} type="wishlist" />
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			)}

			{/* Recently Viewed Section */}
			{recentlyViewed.length > 0 && (
				<div className="bg-white rounded-lg shadow-sm ">
					<div className="flex items-center justify-between p-4 border-b border-gray-200">
						<h2 className="text-lg font-bold text-gray-500">بازدیدهای اخیر شما</h2>
						<Link
							to="/profile/recently-viewed"
							className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
						>
							مشاهده همه
							<FaAngleLeft />
						</Link>
					</div>
					
					<div className="p-4">
						<Swiper
							modules={[Pagination, Navigation]}
							spaceBetween={16}
							navigation
							breakpoints={{
								320: { slidesPerView: 1 },
								640: { slidesPerView: 2 },
								768: { slidesPerView: 3 },
								1024: { slidesPerView: 4 },
							}}
						>
							{recentlyViewed.map((product) => (
								<SwiperSlide key={product.id}>
									<ProductCard product={product} type="recent" />
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			)}

			{/* Quick Actions */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
				<Link
					to="/profile/personal-info"
					className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center border border-gray-200"
				>
					<FaUser className="text-2xl text-blue-500 mx-auto mb-2" />
					<p className="text-sm font-medium">اطلاعات حساب</p>
				</Link>
				
				<Link
					to="/profile/addresses"
					className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center border border-gray-200"
				>
					<FaAngleLeft className="text-2xl text-green-500 mx-auto mb-2" />
					<p className="text-sm font-medium">آدرس‌ها</p>
				</Link>
				
				<Link
					to="/profile/comments"
					className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center border border-gray-200"
				>
					<FaAngleLeft className="text-2xl text-purple-500 mx-auto mb-2" />
					<p className="text-sm font-medium">دیدگاه‌ها</p>
				</Link>
				
				<Link
					to="/profile/notifications"
					className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center border border-gray-200"
				>
					<FaAngleLeft className="text-2xl text-orange-500 mx-auto mb-2" />
					<p className="text-sm font-medium">پیام‌ها</p>
				</Link>
			</div>
		</div>
	);
};

export default UserProfileHomePage;