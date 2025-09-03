import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import axios from "axios";
import { LuPencilLine } from "react-icons/lu";
import { FaShoppingBasket } from "react-icons/fa";
import { RiHomeSmile2Line } from "react-icons/ri";
import { PiHeartStraightBold } from "react-icons/pi";
import { FaStreetView } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { FaStore } from "react-icons/fa";
import "./profileMenu.css";

const menu = [
	{
		id: 1,
		title: "خلاصه فعالیت ها",
		url: "",
		icon: <RiHomeSmile2Line />,
	},
	{
		id: 2,
		title: "سفارش ها",
		url: "orders",
		icon: <FaShoppingBasket />,
	},
	{
		id: 3,
		title: "لیست های من",
		url: "lists",
		icon: <PiHeartStraightBold />,
	},
	{
		id: 4,
		title: "دیدگاه ها و پرسش ها",
		url: "comments",
		icon: <LuPencilLine />,
	},
	{
		id: 5,
		title: "آدرس های من",
		url: "addresses",
		icon: <FaStreetView />,
	},
	{
		id: 6,
		title: "پیام ها",
		url: "notifications",
		icon: <MdNotificationsNone />,
	},
	{
		id: 7,
		title: "اطلاعات حساب کاربری",
		url: "personal-info",
		icon: <BsPersonCircle />,
	},
];

const ProfileMenu = () => {
	const { user, authTokens, logoutUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState(null);
	const [isSeller, setIsSeller] = useState(false);

	
	const fetchUserInfo = async () => {
		try {
			const response = await axios.get(
				"http://127.0.0.1:8000/api/accounts/profile/",
				{
					headers: {
						Authorization: `Bearer ${authTokens?.access}`,
					},
				}
			);
			setUserInfo(response.data);
		} catch (error) {
			setUserInfo({
				phone_number: user?.phone_number,
				full_name: user?.full_name || 'کاربر'
			});
		}
	};

// 	const checkIfSeller = async () => {
//   try {
//     const roleResponse = await axios.get(
//       'http://127.0.0.1:8000/api/accounts/check-role/',
//       {
//         headers: { Authorization: `Bearer ${authTokens?.access}` }
//       }
//     );
    
//     console.log('User role:', roleResponse.data);
    
//     if (roleResponse.data.is_seller) {
//       const sellerResponse = await axios.get(
//         'http://127.0.0.1:8000/api/sellers/profile/',
//         {
//           headers: { Authorization: `Bearer ${authTokens?.access}` }
//         }
//       );
//     } else {
//       console.log('User is not a seller');
     
//     }
    
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };

	const handleLogout = () => {
		logoutUser();
		navigate('/');
	};
	const checkUserRole = async () => {
  try {
    const response = await axios.get(
      'http://127.0.0.1:8000/api/accounts/check-role/',
      {
        headers: { Authorization: `Bearer ${authTokens?.access}` }
      }
    );
    
    console.log('User role:', response.data);
    
    if (!response.data.is_seller) {
      console.log('User is not a seller');
      // Redirect to seller registration or show appropriate message
    }
  } catch (error) {
    console.error('Error checking role:', error);
  }
};
useEffect(() => {
		if (user && authTokens) {
			checkUserRole();
			fetchUserInfo();
			// checkIfSeller();
			
		}
	}, [user, authTokens]);

	return (
		<div className="menu border-1 border-gray-200 rounded-md m-6 p-4">
			{/* User Info Section */}
			<div className="flex justify-between w-full my-2.5 items-center mb-10">
				<div className="flex flex-col">
					<p className="font-medium">
						{userInfo?.full_name || 'کاربر عزیز'}
					</p>
					<p className="text-gray-400 text-xs mt-2">
						{userInfo?.phone_number || user?.phone_number || ''}
					</p>
				</div>
				<div>
					<Link to="/profile/personal-info">
						<LuPencilLine className="text-blue-500 w-6 h-5 cursor-pointer hover:text-blue-600" />
					</Link>
				</div>
			</div>

			{/* Menu Items */}
			{menu.map((item) => (
				<Link to={item.url} key={item.id}>
					<div className="item flex items-center justify-baseline gap-7 h-14 text-sm font-medium border-t border-gray-200 hover:bg-gray-50 transition-colors">
						<p className="icon text-xl">{item.icon}</p>
						<p className="title w-full text-gray-600">{item.title}</p>
					</div>
				</Link>
			))}

			{/* Seller Section - Only show if user is a seller */}
			{isSeller && (
				<Link to="/seller-profile">
					<div className="item flex items-center justify-baseline gap-7 h-14 text-sm font-medium border-t border-gray-200 hover:bg-blue-50 transition-colors">
						<p className="icon text-xl text-blue-600">
							<FaStore />
						</p>
						<p className="title w-full text-blue-600 font-semibold">
							پنل فروشندگی
						</p>
					</div>
				</Link>
			)}

			{/* Become Seller - Only show if user is NOT a seller */}
			{!isSeller && (
				<Link to="/seller-register">
					<div className="item flex items-center justify-baseline gap-7 h-14 text-sm font-medium border-t border-gray-200 hover:bg-green-50 transition-colors">
						<p className="icon text-xl text-green-600">
							<FaStore />
						</p>
						<p className="title w-full text-green-600">
							ثبت نام فروشندگی
						</p>
					</div>
				</Link>
			)}

			{/* Logout */}
			<div 
				onClick={handleLogout}
				className="item flex items-center justify-baseline gap-7 h-14 text-sm font-medium border-t border-gray-200 hover:bg-red-50 transition-colors cursor-pointer"
			>
				<p className="icon text-xl text-red-600">
					<IoMdExit />
				</p>
				<p className="title w-full text-red-600">
					خروج از حساب کاربری
				</p>
			</div>
		</div>
	);
};

export default ProfileMenu;