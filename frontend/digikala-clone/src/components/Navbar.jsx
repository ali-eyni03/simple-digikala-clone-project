import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import logo from "../assets/full-horizontal.svg";
import banner from "../assets/banner-header.jpg";
import { RiShoppingCartLine } from "react-icons/ri";
import { MdOutlineNotifications } from "react-icons/md";
import { MdExitToApp } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { TbRosetteDiscount } from "react-icons/tb";
import { FaShoppingBasket, FaStore } from "react-icons/fa";
import { RiFireLine } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsCaretDownFill} from "react-icons/bs";
import { MdPersonOutline } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import { PiHeartStraightBold } from "react-icons/pi";
import { FaStreetView } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { RiHomeSmile2Line } from "react-icons/ri";

function Navbar() {
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const { user, authTokens, logoutUser } = useContext(AuthContext);
	
	let totalItems = 0;
	try {
		const { totalItems: cartItems } = useCart();
		totalItems = cartItems || 0;
	} catch (error) {
		totalItems = 0;
	}

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [userRole, setUserRole] = useState(null); // 'user' or 'seller'
	const [sellerInfo, setSellerInfo] = useState(null);
	const [roleCheckLoading, setRoleCheckLoading] = useState(false);
	const menuRef = useRef(null);
	const navigate = useNavigate();

	const userMenu = [
		{
			id: 1,
			title: "پروفایل من",
			url: "/profile",
			icon: <RiHomeSmile2Line />,
		},
		{
			id: 2,
			title: "سفارش ها",
			url: "/profile/orders",
			icon: <FaShoppingBasket />,
		},
		{
			id: 3,
			title: "آدرس ها",
			url: "/profile/addresses",
			icon: <FaStreetView />,
		},
		{
			id: 4,
			title: "لیست ها",
			url: "/profile/lists",
			icon: <PiHeartStraightBold />,
		},
		{
			id: 5,
			title: "دیدگاه ها و پرسش ها",
			url: "/profile/comments",
			icon: <LuPencilLine />,
		},
	];

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (user && authTokens && !roleCheckLoading) {
			checkUserRole();
		} else {
			setUserRole(null);
			setSellerInfo(null);
		}
	}, [user, authTokens]);

	const checkUserRole = async () => {
		if (roleCheckLoading) return;
		
		setRoleCheckLoading(true);
		
		try {
			const roleResponse = await axios.get(
				"http://127.0.0.1:8000/api/accounts/check-role/",
				{
					headers: {
						Authorization: `Bearer ${authTokens?.access}`,
					},
				}
			);
			
			if (roleResponse.data.is_seller) {
				try {
					const sellerResponse = await axios.get(
						"http://127.0.0.1:8000/api/sellers/profile/",
						{
							headers: {
								Authorization: `Bearer ${authTokens?.access}`,
							},
						}
					);
					
					if (sellerResponse.data && sellerResponse.data.store_name) {
						setUserRole('seller');
						setSellerInfo(sellerResponse.data);
					} else {
						setUserRole('user');
					}
				} catch (sellerError) {
					console.warn('Seller profile not accessible:', sellerError.message);
					setUserRole('user');
				}
			} else {
				setUserRole('user');
			}
		} catch (error) {
			console.warn('Role check failed:', error.message);
			setUserRole('user');
		} finally {
			setRoleCheckLoading(false);
		}
	};

	const handleLogout = () => {
		logoutUser();
		setIsMenuOpen(false);
		setUserRole(null);
		setSellerInfo(null);
		navigate('/');
	};

	return (
		<div className="navbar w-full m-auto shadow-[0_4px_3px_-4px_gray]">
			{/* Top Advertisement Banner */}
			<div className="w-full">
				<img
					src={banner}
					alt="Advertisement Banner"
					className="w-full object-cover h-15"
				/>
			</div>

			{/* Main Navigation */}
			<div className="flex w-98/100 m-auto pt-2 pb-2 justify-end">
				<div className="flex items-center w-85/100 gap-4">
					<Link to="/">
						<img
							className="object-cover w-60 mt-2"
							src={logo}
							alt="Digikala Logo"
						/>
					</Link>
					<div
						className={`flex items-center gap-[5px] w-full search-bar ${
							isSearchFocused ? "focused" : ""
						}`}
					>
						<div className="relative w-1/2">
							<input
								className="
									rounded-sm
									p-2
									pr-10
									w-full
									text-sm
									outline-none
									bg-gray-100
									border-b-[2px]
									border-transparent
									focus:border-b-blue-300
									focus:text-gray-500
									transition-colors
									duration-200
									h-10
								"
								type="text"
								placeholder="جستجو"
								onFocus={() => setIsSearchFocused(true)}
								onBlur={() => setIsSearchFocused(false)}
							/>
							<FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
						</div>
					</div>
				</div>

				<div className="nav-left w-15/100 flex gap-4 justify-center items-center ml-1">
					<Link to="/profile/notifications">
						<MdOutlineNotifications className="w-6 h-6" />
					</Link>

					{user ? (
						<div className="relative" ref={menuRef}>
							<div
								className="flex items-center gap-4 cursor-pointer"
								onClick={() => setIsMenuOpen(!isMenuOpen)}
							>
								<div className="flex items-center justify-center gap-2">
									<MdPersonOutline className="w-7 h-7" />
									<BsCaretDownFill className="w-3 h-3" />
								</div>
							</div>

							{isMenuOpen && (
								<div className="absolute left-0 mt-2 w-72 bg-white border border-gray-400 rounded-lg shadow-md z-50 p-4">
									{/* User Info Section */}
									<div className="px-4 py-3 border-b">
										<p className="text-sm text-gray-600">
											{userRole === 'seller' ? 'فروشنده' : 'کاربر'} عزیز
										</p>
										<p className="text-base font-semibold text-gray-800 mt-1">
											{userRole === 'seller' && sellerInfo 
												? sellerInfo.store_name 
												: user.phone_number}
										</p>
										{roleCheckLoading && (
											<p className="text-xs text-gray-500">در حال بررسی نقش کاربر...</p>
										)}
									</div>

									{/* User Profile Section - Always visible */}
									<div className="py-2">
										<p className="px-4 py-2 text-xs text-gray-500 font-semibold">
											حساب کاربری
										</p>
										
										{userMenu.map((item) => (
											<Link 
												to={item.url} 
												key={item.id}
												onClick={() => setIsMenuOpen(false)}
											>
												<div className="item flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
													<div className="icon text-lg text-gray-600">
														{item.icon}
													</div>
													<p className="text-gray-700">
														{item.title}
													</p>
												</div>
											</Link>
										))}
									</div>

									{/* Seller Section - Only for sellers */}
									{userRole === 'seller' && !roleCheckLoading && (
										<>
											<div className="border-t pt-2">
												<p className="px-4 py-2 text-xs text-gray-500 font-semibold">
													پنل فروشندگی
												</p>
												<Link 
													to="/seller-profile"
													onClick={() => setIsMenuOpen(false)}
												>
													<div className="item flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 transition-colors cursor-pointer">
														<div className="icon text-lg text-blue-600">
															<FaStore />
														</div>
														<p className="text-blue-600 font-semibold">
															داشبورد فروشندگی
														</p>
													</div>
												</Link>
											</div>
										</>
									)}

									{/* Become Seller - Only for non-sellers */}
									{userRole === 'user' && !roleCheckLoading && (
										<>
											<div className="border-t pt-2">
												<Link 
													to="/seller-register"
													onClick={() => setIsMenuOpen(false)}
												>
													<div className="item flex items-center gap-3 px-4 py-3 text-sm hover:bg-green-50 transition-colors cursor-pointer">
														<div className="icon text-lg text-green-600">
															<FaStore />
														</div>
														<p className="text-green-600 font-semibold">
															ثبت نام فروشندگی
														</p>
													</div>
												</Link>
											</div>
										</>
									)}

									{/* Logout */}
									<div className="border-t pt-2">
										<button 
											onClick={handleLogout}
											className="w-full"
										>
											<div className="item flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 transition-colors cursor-pointer">
												<div className="icon text-lg text-red-600">
													<IoMdExit />
												</div>
												<p className="text-red-600">
													خروج از حساب کاربری
												</p>
											</div>
										</button>
									</div>
								</div>
							)}
						</div>
					) : (
						<Link
							to="/users/login/"
							className="
								rounded-md
								border
								border-gray-200
								p-2.5
								text-[11px]
								gap-[5px]
								w-32
								flex
								items-center
								justify-center
								font-medium
								cursor-pointer
								transition
								hover:bg-gray-50
							"
						>
							<MdExitToApp className="w-[16px] h-[16px]" />
							<span>ورود | ثبت نام</span>
						</Link>
					)}
					
					{/* Shopping Cart with counter */}
					<Link to="/cart" className="relative">
						<RiShoppingCartLine className="w-5 h-5" />
						{totalItems > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
								{totalItems > 99 ? '99+' : totalItems}
							</span>
						)}
					</Link>
				</div>
			</div>

			{/* Categories Menu */}
			<div className="flex w-98/100 m-auto mb-2.5 justify-end-safe items-end py-2">
				<div className="flex w-full">
					<ul className="flex text-sm text-gray-600 mt-2 gap-3 components">
						<li className="font-semibold text-black pl-6 border-l-1 border-l-gray-500">
							<a href="#">
								<p>دسته‌بندی کالاها</p>
								<IoMenu />
							</a>
						</li>
						<li className="pl-6">
							<a href="#">
								<p>شگفت‌انگیزها</p>
								<TbRosetteDiscount />
							</a>
						</li>
						<li className="pl-6">
							<a href="#">
								<p>سوپرمارکت</p>
								<FaShoppingBasket />
							</a>
						</li>
						<li className="pl-6 border-l-1 border-l-gray-500">
							<a href="#">
								<p>پرفروش‌ترین‌ها</p>
								<RiFireLine />
							</a>
						</li>
						<li className="pl-6">
							<a href="#">
								<p>سوالی دارید؟</p>
							</a>
						</li>
						<li>
							{/* Show different text based on user role */}
							{userRole === 'seller' ? (
								<Link to="/seller-profile">
									<p className="text-blue-600 font-semibold">
										پنل فروشندگی
									</p>
								</Link>
							) : (
								<Link to="/seller">
									<p>در دیجی کالا بفروشید!</p>
								</Link>
							)}
						</li>
					</ul>
				</div>
				
				{/* Location */}
				<div className="text-[10px] flex flex-row-reverse gap-1 items-center justify-center bg-orange-50 rounded-3xl text-orange-600 p-2 font-medium w-15/100">
					<p>شهر خود را انتخاب کنید</p>
					<HiOutlineLocationMarker className="h-[16px] w-[16px]" />
				</div>
			</div>
		</div>
	);
}

export default Navbar;