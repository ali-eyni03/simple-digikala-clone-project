// راه حل 1: اضافه کردن useState برای loading
import { NavLink } from "react-router-dom";
import { MdOutlinePersonOutline } from "react-icons/md";
import { TbLayoutDashboard } from "react-icons/tb";
import { IoStorefrontOutline } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { TiMessages } from "react-icons/ti";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../auth/AuthContext";
import { useState, useEffect, useContext } from "react";

const SellerProfileMenu = () => {
	const { authTokens } = useContext(AuthContext);
	const [sellerProfile, setSellerProfile] = useState(null);
	const [loading, setLoading] = useState(true); // ✅ اضافه کردن useState برای loading

	const menuItems = [
		{
			id: 1,
			title: "داشبورد فروشنده",
			url: "", 
			icon: <TbLayoutDashboard size={30} />,
		},
		{
			id: 2,
			title: "اطلاعات مالک کسب و کار",
			url: "info", 
			icon: <MdOutlinePersonOutline size={30} />,
		},
		{
			id: 3,
			title: "اطلاعات فروشنده و فروشگاه",
			url: "store-info", 
			icon: <IoStorefrontOutline size={30} />,
		},
		{
			id: 4,
			title: "آدرس ها",
			url: "address", 
			icon: <GrMapLocation size={30} />,
		},
	];

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const profileResponse = await axios.get(
					"http://127.0.0.1:8000/api/sellers/profile/",
					{
						headers: {
							Authorization: `Bearer ${authTokens?.access}`,
						},
					}
				);
				setSellerProfile(profileResponse.data);				
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			} finally {
				setLoading(false); // ✅ حالا کار می‌کند
			}
		};

		if (authTokens) {
			fetchProfileData();
		}
	}, [authTokens]);

	// ✅ نمایش loading state
	if (loading) {
		return (
			<div className="m-6 flex flex-col gap-3 p-4">
				<div className="animate-pulse bg-gray-200 h-72 rounded-lg"></div>
				<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
				<div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
			</div>
		);
	}

	return (
		<nav className="m-6 flex flex-col gap-3 p-4 border-1rounded-lg bg-transparent">
			{/* باقی کد بدون تغییر */}
			<div className="flex justify-between w-full items-center text-xl">
				<div className="border rounded-lg border-gray-200 p-6 w-full h-72 flex flex-col items-center justify-between bg-white shadow-lg">
					<div className="flex items-center justify-between flex-col">
						<div className="w-18 h-18 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
							<div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white text-4xl font-semibold">
								ع
							</div>
						</div>
					</div>
					<div className="p2 flex items-center justify-center my-4 text-gray-600 font-semibold">
						<p>{sellerProfile?.store_name || "فروشنده"}</p>
					</div>
					<div className="flex gap-8 justify-between items-center mt-4">
						<div className="w-16 h-16 rounded-lg border border-gray-200 flex flex-col text-gray-600 text-base items-center justify-center p-2">
							<TiMessages size={24} />
							<div>پیام ها</div>
						</div>
						<div className="w-16 h-16 rounded-lg border border-gray-200 flex flex-col text-gray-600 text-base items-center justify-center p-2">
							<TiMessages size={24} />
							<div>پیام ها</div>
						</div>
						<div className="w-16 h-16 rounded-lg border border-gray-200 flex flex-col text-gray-600 text-base items-center justify-center p-2">
							<TiMessages size={24} />
							<div>پیام ها</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between w-full items-center text-xl shadow-lg my-2 border border-gray-200 rounded-lg">
				<div className="w-full rounded-lg h-[25rem] flex flex-col items-center justify-baseline bg-white">
					<div className="border-b border-gray-400 p-2 w-full flex items-center justify-center py-4 text-gray-600">
						امتیاز عملکرد شما
					</div>
					<div className="flex flex-col items-center justify-center mb-4">
						<div className="border-gray-400 p-2 w-full flex items-center justify-center py-4 text-gray-600 flex-row-reverse">
							{[1, 2, 3, 4, 5].map((item) =>
								item <= 2 ? (
									<FaStar key={item} size={34} color="gold" />
								) : (
									<CiStar key={item} size={36} color="#dedede" />
								)
							)}
						</div>
						<div className="text-gray-500 font-semibold text-base my-2">
							عضویت از ۱ سال و ۱ ماه پیش
						</div>
						<div className="flex gap-2 items-center justify-between w-full px-4 my-4">
							<div className="flex flex-col items-center justify-center ml-2">
								<span className="text-gray-500 text-sm w-14 text-center">
									تاخیر در ارسال
								</span>
								<span className="rounded-lg bg-gray-100 text-green-500 font-semibold text-xl p-2 shadow-lg my-2 w-18 text-center">
									۰٪
								</span>
							</div>
							<div className="flex items-center flex-col justify-center border-x-1 border-gray-200 px-4">
								<span className="text-gray-500 text-sm w-10 text-center">
									لغو سفارش
								</span>
								<span className="rounded-lg bg-gray-100 text-green-500 font-semibold text-xl p-2 shadow-lg my-2 w-18 text-center">
									۰.۳ ٪
								</span>
							</div>
							<div className="flex flex-col items-center justify-center">
								<span className="text-gray-500 text-sm w-18 mr-2 text-center">
									بازگشت کالا از مشتری
								</span>
								<span className="rounded-lg bg-gray-100 text-red-500 font-semibold text-xl p-2 shadow-lg my-2 w-18 text-center">
									٪۴.۲۱
								</span>
							</div>
						</div>

						<div className="my-2 w-full mx-auto max-w-[90%]">
							<div className="w-full flex items-center justify-between text-gray-600 text-base font-medium">
								<div>رضایت خرید مشتریان از کالا</div>
								<div>٪ ۸۰.۸</div>
							</div>
							<div className="border rounded-lg bg-gray-100 h-2 my-2 border-gray-200 flex items-center justify-baseline">
								<div className="h-2 bg-[#55cfb3] rounded-lg w-[80%]"></div>
							</div>
							<div className="text-sm font-semibold text-gray-600">از ۲۷۶۲ رأی</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg border border-gray-200 shadow-lg text-gray-600 text-lg">
				{menuItems.map((item) =>
					item.id !== 4 ? (
						<div
							className="flex items-center justify-baseline gap-4 border-b border-gray-300 p-5"
							key={item.id}
						>
							<div className="">{item.icon}</div>
							<NavLink
								to={item.url}
								end
								className={({ isActive }) =>
									isActive
										? "font-bold text-[#1bb1d4]"
										: "text-gray-700"
								}
							>
								{item.title}
							</NavLink>
						</div>
					) : (
						<div
							className="flex items-center justify-baseline gap-4 p-5"
							key={item.id}
						>
							<div className="">{item.icon}</div>
							<NavLink
								to={item.url}
								end
								className={({ isActive }) =>
									isActive
										? "font-bold text-[#1bb1d4]"
										: "text-gray-700"
								}
							>
								{item.title}
							</NavLink>
						</div>
					)
				)}
			</div>
		</nav>
	);
};

export default SellerProfileMenu;