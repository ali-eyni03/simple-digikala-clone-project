import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../auth/AuthContext";
import axios from "axios";
import { FaAngleLeft } from "react-icons/fa";
import { PiPencilSimpleLine } from "react-icons/pi";
import { FaPlus } from "react-icons/fa6";
import Modal from "../../../components/Modal";


const SellerProfileInfo = ()=>{
	const { authTokens } = useContext(AuthContext);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [nationalId, setNationalId] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [profileInfo, setProfileInfo] = useState({});
	const [shabaNumber, setShabaNumber] = useState("");
	const [userJob, setUserJob] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [storeName, setStoreName] = useState("");
	const [storeAddress, setStoreAddress] = useState("");
	const [currentModalType, setCurrentModalType] = useState("");
	const [loading, setLoading] = useState(false);
	const handleInputChange = (setter) => (e) => {
		setter(e.target.value);
	};

	useEffect(() => {
		getProfileInfo();
	}, []);

	
const getProfileInfo = () => {
    axios.get(`http://127.0.0.1:8000/api/sellers/profile/detail/`, {
        headers: {
            Authorization: `Bearer ${authTokens?.access}`,
        },
    })
        .then((response) => {
            const data = response.data;
            setProfileInfo(data);
            
            const fullName = data.ceo_full_name || "";
            const nameParts = fullName.split(' ');
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(' ') || "");
            setNationalId(data.national_code || "");
            setBirthDate(""); 
            setShabaNumber(data.shaba_number || "");
            setUserJob("فروشنده");
            setPhoneNumber(data.user_phone_number || "");
            setUserEmail(""); 
			setStoreName(data.store_name || "");
			setStoreAddress(data.store_address || "");
        })
        .catch((err) => {
            console.log(err);
            if (err.response?.status === 403) {
                console.log('Access denied - not a seller');
            }
        });
};

	const openModal = (type) => {
		setCurrentModalType(type);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setCurrentModalType("");
		setOldPassword("");
		setNewPassword("");
	};

	const handleSave = async () => {
    setLoading(true);
    try {
        const formData = new FormData();
        
        // Seller fields - استفاده از state های موجود شما
        formData.append('store_name', storeName || '');
        formData.append('store_address', storeAddress || '');
        formData.append('shaba_number', shabaNumber || '');
        formData.append('national_code', nationalId || '');
        formData.append('is_legal', true);
        
        // SellerProfile fields
        const fullName = `${firstName} ${lastName}`.trim();
        formData.append('ceo_full_name', fullName);
        
        // Handle profile image (اگر دارید)
        // if (profileImage instanceof File) {
        //     formData.append('profile_image', profileImage);
        // }

        const response = await axios.put(
            'http://127.0.0.1:8000/api/sellers/profile/update/',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${authTokens?.access}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        console.log('Profile updated successfully:', response.data);
        alert('اطلاعات با موفقیت بروزرسانی شد');
        
        // بروزرسانی state ها با داده‌های جدید
        const data = response.data;
        setStoreName(data.store_name || '');
        setStoreAddress(data.store_address || '');
        setShabaNumber(data.shaba_number || '');
        setNationalId(data.national_code || '');
        const fullNameParts = (data.ceo_full_name || '').split(' ');
        setFirstName(fullNameParts[0] || '');
        setLastName(fullNameParts.slice(1).join(' ') || '');

    } catch (error) {
        console.error('Error updating profile:', error);
        
        if (error.response?.status === 403) {
            alert('شما اجازه انجام این عمل را ندارید');
        } else if (error.response?.status === 401) {
            alert('جلسه شما منقضی شده است. لطفاً مجدداً وارد شوید');
        } else if (error.response?.data) {
            const errorMessages = Object.values(error.response.data).flat();
            alert(errorMessages.join('\n'));
        } else {
            alert('خطا در بروزرسانی اطلاعات');
        }
    } finally {
        setLoading(false);
    }
};

	const profileItems = [
		{
			id: 1,
			title: "نام و نام خانوادگی",
			text: `${firstName} ${lastName}`.trim(),
			icon: firstName && lastName ? <PiPencilSimpleLine /> : <FaPlus />,
			editFunction: () => openModal("fullname"),
		},
		{
			id: 2,
			title: "کد ملی",
			text: nationalId || "-",
			icon: nationalId ? <PiPencilSimpleLine /> : <FaPlus />,
			editFunction: () => openModal("fullname"),
		},
		{
			id: 3,
			title: "شماره موبایل",
			text: phoneNumber || "-",
			icon: phoneNumber ? <PiPencilSimpleLine /> : <FaPlus />,
			editFunction: () => openModal("phoneNumber"),
		},
		{
			id: 4,
			title: "تاریخ تولد",
			text: birthDate || "-",
			icon: birthDate ? <PiPencilSimpleLine /> : <FaPlus />,
			editFunction: () => openModal("fullname"),
		},
		{
			id: 5,
			title: "ایمیل",
			text: userEmail || "-",
			icon: userEmail ? <PiPencilSimpleLine /> : <FaPlus />,
			editFunction: () => openModal("email"),
		},
		{
			id: 6,
			title: "رمز عبور",
			text: "••••••••",
			icon: <PiPencilSimpleLine />,
			editFunction: () => openModal("password"),
		},
		{
			id: 7,
			title: "شماره شبا",
			text: shabaNumber || "-",
			icon: shabaNumber ? <PiPencilSimpleLine /> : <FaPlus />,
			editFunction: () => openModal("shaba"),
		},
		{
			id: 8,
			title: "شغل",
			text: userJob || "-",
			icon: userJob ? <PiPencilSimpleLine /> : <FaPlus />,
			editFunction: () => openModal("job"),
		},
	];

	const renderModalContent = () => {
		switch (currentModalType) {
			case "fullname":
				return (
					<div className="flex flex-col gap-3">
						<label htmlFor="firstName" className="text-gray-500">
							نام
						</label>
						<input
							id="firstName"
							className="rounded-lg bg-gray-200 p-2"
							value={firstName}
							onChange={handleInputChange(setFirstName)}
							placeholder="نام"
						/>
						<label htmlFor="lastName" className="text-gray-500">
							نام خانوادگی
						</label>
						<input
							id="lastName"
							className="rounded-lg bg-gray-200 p-2"
							value={lastName}
							onChange={handleInputChange(setLastName)}
							placeholder="نام خانوادگی"
						/>
						<label htmlFor="nationalId" className="text-gray-500">
							کد ملی
						</label>
						<input
							id="nationalId"
							value={nationalId}
							onChange={handleInputChange(setNationalId)}
							placeholder="کد ملی"
							className="rounded-lg bg-gray-200 p-2"
						/>
						<label htmlFor="birthDate" className="text-gray-500">
							تاریخ تولد
						</label>
						<input
							id="birthDate"
							className="rounded-lg bg-gray-200 p-2"
							value={birthDate}
							onChange={handleInputChange(setBirthDate)}
							placeholder="تاریخ تولد YYYY-MM-DD"
						/>
					</div>
				);

			case "email":
				return (
					<div className="flex flex-col gap-3">
						<label htmlFor="userEmail" className="text-gray-500">
							ایمیل
						</label>
						<input
							id="userEmail"
							className="rounded-lg bg-gray-200 p-2"
							value={userEmail}
							onChange={handleInputChange(setUserEmail)}
							placeholder="ایمیل"
						/>
					</div>
				);

			case "phoneNumber":
				return (
					<div className="flex flex-col gap-3">
						<label htmlFor="phoneNumber" className="text-gray-500">
							شماره موبایل
						</label>
						<input
							id="phoneNumber"
							className="rounded-lg bg-gray-200 p-2"
							value={phoneNumber}
							onChange={handleInputChange(setPhoneNumber)}
							placeholder="شماره موبایل جدید"
						/>
					</div>
				);

			case "password":
				return (
					<div className="flex flex-col gap-3">
						<label className="text-gray-500">رمز عبور قبلی</label>
						<input
							type="password"
							className="rounded-lg bg-gray-200 p-2"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							placeholder="رمز عبور قبلی"
						/>
						<label className="text-gray-500">رمز عبور جدید</label>
						<input
							type="password"
							className="rounded-lg bg-gray-200 p-2"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="رمز عبور جدید"
						/>
					</div>
				);

			case "shaba":
				return (
					<div className="flex flex-col gap-3">
						<label htmlFor="shabaNumber" className="text-gray-500">
							شماره شبا
						</label>
						<input
							id="shabaNumber"
							className="rounded-lg bg-gray-200 p-2"
							value={shabaNumber}
							onChange={handleInputChange(setShabaNumber)}
							placeholder="شماره شبا"
						/>
					</div>
				);

			case "job":
				return (
					<div className="flex flex-col gap-3">
						<label htmlFor="userJob" className="text-gray-500">
							شغل
						</label>
						<input
							id="userJob"
							className="rounded-lg bg-gray-200 p-2"
							value={userJob}
							onChange={handleInputChange(setUserJob)}
							placeholder="شغل"
						/>
					</div>
				);

			default:
				return null;
		}
	};

	const getModalTitle = () => {
		switch (currentModalType) {
			case "fullname":
				return "ثبت اطلاعات شناسایی";
			case "email":
				return "تغییر ایمیل";
			case "phoneNumber":
				return "تغییر شماره موبایل";
			case "password":
				return "تغییر رمز عبور";
			case "shaba":
				return "تغییر شماره شبا";
			case "job":
				return "تغییر شغل";
			default:
				return "";
		}
	};

	return (
		<>
			

			{/* Profile Items Grid */}
			<div className="grid grid-cols-2 gap-4 border border-gray-200 rounded-lg m-4 p-4 bg-white shadow-lg">
				{profileItems.map((item) => (
					<div
						key={item.id}
						className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
						onClick={item.editFunction}
					>
						<div className="flex flex-col gap-1">
							<p className="text-gray-500 text-sm">{item.title}</p>
							<p className="text-gray-800">{item.text}</p>
						</div>
						<div className="text-gray-600">{item.icon}</div>
					</div>
				))}
			</div>

			{/* Modal */}
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<h2 className="text-lg font-semibold mb-4">{getModalTitle()}</h2>
				
				{renderModalContent()}

				<div className="flex justify-end gap-2 mt-6">
					<button
						onClick={closeModal}
						className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
					>
						انصراف
					</button>
					<button
						onClick={handleSave}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
					>
						ذخیره
					</button>
				</div>
			</Modal>
		</>
	);
};

export default SellerProfileInfo;