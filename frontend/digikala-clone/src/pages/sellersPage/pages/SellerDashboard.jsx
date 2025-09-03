import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { RiShoppingCartLine } from "react-icons/ri";
import "./sellerDashboard.css";
import { TiTick } from "react-icons/ti";
import { FaPlus } from "react-icons/fa6";
import { TiPlus } from "react-icons/ti";
import { FaAngleDown } from "react-icons/fa6";
import { AuthContext } from "../../../auth/AuthContext";
import axios from "axios";

function CardItem({ products }) {
	const navigate = useNavigate();

	if (!products || products.length === 0) {
		return (
			<div className="w-full max-w-[820px] mx-auto bg-white rounded-lg p-8 text-center">
				<div className="text-gray-400 mb-4">
					<RiShoppingCartLine size={48} className="mx-auto" />
				</div>
				<p className="text-gray-600 mb-4">هنوز محصولی اضافه نکرده‌اید</p>
				<Link
					to="/seller-profile/products"
					className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
				>
					<FaPlus />
					افزودن اولین محصول
				</Link>
			</div>
		);
	}

	const handleProductClick = (productId) => {
		navigate(`/seller-profile/product/${productId}`);
	};

	return (
		<div className="w-full max-w-[820px] mx-auto">
			<Swiper
				modules={[Pagination]}
				centeredSlides={false}
				slideToClickedSlide={true}
				dir="rtl"
				spaceBetween={16}
				breakpoints={{
					1920: { slidesPerView: 4 },
					1028: { slidesPerView: 4 },
					768: { slidesPerView: 2 },
					320: { slidesPerView: 1 },
				}}
			>
				{products.map((product) => (
					<SwiperSlide key={product.id}>
						<div
							onClick={() => handleProductClick(product.id)}
							className="bg-white flex flex-col justify-between items-center w-full h-88 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
						>
							<div className="p-1">
								{product.main_image ? (
									<img
										src={product.main_image}
										alt={product.name}
										className="object-contain w-full h-48"
									/>
								) : (
									<div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
										<span className="text-gray-400">بدون تصویر</span>
									</div>
								)}
							</div>
							<div className="text-sm w-full text-gray-700 flex justify-center px-2">
								<p className="truncate">{product.name}</p>
							</div>
							<div className="flex justify-between items-center px-2">
								<div className="text-xs flex">
									<div className="font-semibold">
										<p className="text-base">
											{new Intl.NumberFormat('fa-IR').format(product.price)}
										</p>
									</div>
									<p className="relative right-3 top-1.5 font-semibold">تومان</p>
								</div>
							</div>
							<div className="flex items-center justify-between text-blue-500 p-2 rounded-lg border border-blue-500 text-sm my-4 w-[80%] m-auto">
								<div>
									<p>مشاهده جزئیات</p>
								</div>
								<div>
									<FaAngleLeft />
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
const ProfileHomePage = () => {
	const { authTokens } = useContext(AuthContext);
	const [dashboardData, setDashboardData] = useState(null);
	const [productStats, setProductStats] = useState(null);
	const [recentProducts, setRecentProducts] = useState([]);
	const [sellerProfile, setSellerProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const profileResponse = await axios.get(
					"http://127.0.0.1:8000/api/sellers/profile/",
					{
						headers: {
							Authorization: `Bearer ${authTokens?.access}`,
						},
					}
				);

				const statsResponse = await axios.get(
					"http://127.0.0.1:8000/api/products/seller/stats/",
					{
						headers: {
							Authorization: `Bearer ${authTokens?.access}`,
						},
					}
				);

				const productsResponse = await axios.get(
					"http://127.0.0.1:8000/api/products/seller/list/",
					{
						headers: {
							Authorization: `Bearer ${authTokens?.access}`,
						},
					}
				);

				setSellerProfile(profileResponse.data);
				setProductStats(statsResponse.data);
				setRecentProducts(productsResponse.data.slice(0, 10)); 
				
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			} finally {
				setLoading(false);
			}
		};

		if (authTokens) {
			fetchDashboardData();
		}
	}, [authTokens]);

	const formatNumber = (num) => {
		return new Intl.NumberFormat('fa-IR').format(num || 0);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="p-6">
			{/* Welcome Section */}
			<div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
				<h1 className="text-2xl font-bold mb-2">
					خوش آمدید، {sellerProfile?.store_name || 'فروشنده'}
				</h1>
				<p className="opacity-90">
					آمارها و وضعیت فروشگاه شما در یک نگاه
				</p>
			</div>

			<div className="grid gap-[2rem] grid-cols-3">
				{/* Status indicators */}
				<div className="w-full relative h-12 flex items-center justify-baseline">
					<div className="absolute right-0 -top-1 flex items-center justify-center bg-[#dff9f2] w-7 h-7 rounded-full">
						<div className="rounded-full w-4 h-4 bg-[#55cfb3]"></div>
					</div>
					<div className="flex flex-col items-endline justify-baseline mr-10 gap-2">
						<div className="text-gray-600 font-medium">وضعیت مدارک</div>
						<div className="text-gray-500 font-medium text-sm">تایید شده</div>
					</div>
				</div>
				
				<div className="w-full relative h-12 flex items-center justify-baseline">
					<div className="absolute right-0 -top-1 flex items-center justify-center bg-[#dff9f2] w-7 h-7 rounded-full">
						<div className="rounded-full w-4 h-4 bg-[#55cfb3]"></div>
					</div>
					<div className="flex flex-col items-endline justify-baseline mr-10 gap-2">
						<div className="text-gray-600 font-medium">وضعیت آموزش</div>
						<div className="text-gray-500 font-medium text-sm">با موفقیت گذرانده</div>
					</div>
				</div>
				
				<div className="w-full relative h-12 flex items-center justify-baseline">
					<div className="absolute right-0 -top-1 flex items-center justify-center bg-[#dff9f2] w-7 h-7 rounded-full">
						<div className="rounded-full w-4 h-4 bg-[#55cfb3]"></div>
					</div>
					<div className="flex flex-col items-endline justify-baseline mr-10 gap-2">
						<div className="text-gray-600 font-medium">وضعیت قرارداد</div>
						<div className="text-gray-500 font-medium text-sm">پذیرفته شده</div>
					</div>
				</div>

				{/* Action cards */}
				<div className="border border-gray-200 shadow-lg bg-white p-4 rounded-lg relative box1">
					<span className="font-medium text-lg text-gray-600">افزودن محصول جدید</span>
					<Link 
						to="/seller-profile/products" 
						className="text-white bg-blue-400 w-11 h-11 flex items-center justify-center rounded-2xl absolute -left-5 top-2 cursor-pointer hover:bg-blue-500 transition-colors"
						title="افزودن محصول جدید"
					>
						<TiPlus size={20} />
					</Link>
				</div>
				
				<div className="border border-gray-200 shadow-lg bg-white p-4 rounded-lg relative flex justify-between items-center">
					<span className="font-medium text-lg text-gray-600">تنوع فعال در پرموشن ها</span>
					<div className="flex items-center justify-center gap-1 text-gray-400 font-medium">
						<span>{formatNumber(productStats?.products_with_discount || 0)}</span>
						<span><FaAngleLeft /></span>
					</div>
				</div>
				
				<div className="border border-gray-200 shadow-lg bg-white p-4 rounded-lg relative box1">
					<span className="font-medium text-lg text-gray-600">وضعیت پرداخت | فعال</span>
					<div className="text-white bg-green-500 w-11 h-11 flex items-center justify-center rounded-xl absolute -left-5 top-2 cursor-pointer">
						<TiTick size={24} />
					</div>
				</div>

				{/* Inventory Management - Updated with real data */}
				<div className="bg-white rounded-lg border border-gray-200 shadow-lg flex items-center justify-center flex-col">
					<div className="border-b border-gray-200 p-4 w-full text-right text-gray-600 font-bold text-lg">
						<p>مدیریت موجودی انبار</p>
					</div>
					{[
						{ label: "کل تنوع های فعال", value: formatNumber(productStats?.total_products) },
						{ label: "محصولات ناموجود", value: formatNumber(productStats?.out_of_stock) },
						{ label: "محصولات کم موجود", value: formatNumber(productStats?.low_stock) },
						{ label: "محصولات در انتظار", value: formatNumber(0) }, // This needs to be added to API
						{ label: "محصولات تایید شده", value: formatNumber(productStats?.total_products - productStats?.out_of_stock) },
						{ label: "محصولات رد شده", value: formatNumber(0) }, // This needs to be added to API
					].map((item, index) => (
						<div key={index} className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors">
							<Link to="/seller-profile/products" className="text-gray-500 flex items-center justify-center gap-1 text-base font-semibold hover:text-blue-600 transition-colors">
								<span>{item.label}</span>
								<span><FaAngleDown size={14} /></span>
							</Link>
							<p className="font-semibold text-3xl text-gray-600">{item.value}</p>
						</div>
					))}
				</div>

				{/* Order Management - Placeholder for future implementation */}
				<div className="bg-white rounded-lg border border-gray-200 shadow-lg flex items-center justify-center flex-col">
					<div className="border-b border-gray-200 p-4 w-full text-right text-gray-600 font-bold text-lg">
						<p>مدیریت سفارشات</p>
					</div>
					{[
						{ label: "سفارشات جدید", value: formatNumber(0) },
						{ label: "سفارشات در حال پردازش", value: formatNumber(0) },
						{ label: "سفارشات ارسال شده", value: formatNumber(0) },
						{ label: "سفارشات تحویل شده", value: formatNumber(0) },
						{ label: "سفارشات مرجوع شده", value: formatNumber(0) },
						{ label: "سفارشات لغو شده", value: formatNumber(0) },
					].map((item, index) => (
						<div key={index} className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors">
							<Link to="/seller-profile/orders" className="text-gray-500 flex items-center justify-center gap-1 text-base font-semibold hover:text-blue-600 transition-colors">
								<span>{item.label}</span>
								<span><FaAngleDown size={14} /></span>
							</Link>
							<p className="font-semibold text-3xl text-gray-600">{item.value}</p>
						</div>
					))}
				</div>

				{/* Pricing Management - Enhanced with real data */}
				<div className="bg-white rounded-lg border border-gray-200 shadow-lg flex items-center justify-center flex-col">
					<div className="border-b border-gray-200 p-4 w-full text-right text-gray-600 font-bold text-lg">
						<p>مدیریت قیمت گذاری</p>
					</div>
					{[
						{ label: "محصولات با تخفیف", value: formatNumber(0) }, // Add to API
						{ label: "محصولات بدون تخفیف", value: formatNumber(productStats?.total_products) },
						{ label: "حداکثر تخفیف", value: "0%" },
						{ label: "میانگین تخفیف", value: "0%" },
						{ label: "قیمت های به روز شده امروز", value: formatNumber(0) },
						{ label: "قیمت های نیاز به بررسی", value: formatNumber(0) },
					].map((item, index) => (
						<div key={index} className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors">
							<div className="text-gray-500 flex items-center justify-center gap-1 text-base font-semibold">
								<span>{item.label}</span>
								<span><FaAngleDown size={14} /></span>
							</div>
							<p className="font-semibold text-3xl text-gray-600">{item.value}</p>
						</div>
					))}
				</div>
			</div>

			{/* Recent Products Section */}
			<div className="mt-8 ">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-800">محصولات اخیر</h2>
					<Link 
						to="/seller-profile/products" 
						className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
					>
						مشاهده همه
						<FaAngleLeft />
					</Link>
				</div>
				<CardItem products={recentProducts} />
			</div>

			{/* Quick Stats Summary */}
			<div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 ">
				<div className="bg-blue-100 p-4 rounded-lg  border-l-6 border-blue-500 shadow-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-blue-600 font-semibold">کل محصولات</p>
							<p className="text-2xl font-bold text-blue-800">
								{formatNumber(productStats?.total_products)}
							</p>
						</div>
						<RiShoppingCartLine className="text-blue-500 text-2xl" />
					</div>
				</div>

				<div className="bg-green-100 p-4 rounded-lg border-l-6 border-green-500 shadow-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-green-600 font-semibold">کل موجودی</p>
							<p className="text-2xl font-bold text-green-800">
								{formatNumber(productStats?.total_stock)}
							</p>
						</div>
						<TiTick className="text-green-500 text-2xl" />
					</div>
				</div>

				<div className="bg-red-100 p-4 rounded-lg  border-l-6 border-red-500 shadow-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-red-600 font-semibold">ناموجود</p>
							<p className="text-2xl font-bold text-red-800">
								{formatNumber(productStats?.out_of_stock)}
							</p>
						</div>
						<FaAngleDown className="text-red-500 text-2xl" />
					</div>
				</div>

				<div className="bg-yellow-100 p-4 rounded-lg  border-l-6  border-yellow-500 shadow-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-yellow-600 font-semibold">کم موجود</p>
							<p className="text-2xl font-bold text-yellow-800">
								{formatNumber(productStats?.low_stock)}
							</p>
						</div>
						<FaAngleDown className="text-yellow-500 text-2xl" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileHomePage;