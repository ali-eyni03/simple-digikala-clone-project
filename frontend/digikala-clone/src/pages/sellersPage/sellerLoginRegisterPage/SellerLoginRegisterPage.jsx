import { useState, useContext } from "react";
import { AuthContext } from "../../../auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import supportLogo from "../../../assets/SellerSignIn.c1fdcd84.png";
import digisupportLogo from "../../../assets/digidownload.png";

const RegsisterSeller = ({
	handleVerification,
	phoneOrEmail,
	setPhoneOrEmail,
	password,
	setPassword,
	confirmPassword,
	setConfirmPassword,
	toggleMode,
	nationalCode,
	setNationalCode,
	shabaNumber,
	setShabaNumber,
	storeName,
	setStoreName,
	storeAddress,
	setStoreAddress,
	loading
}) => {
	return (
		<div className="flex justify-center items-center w-full h-[100vh] relative">
			<div className="border border-gray-300 rounded-2xl m-auto p-6 flex flex-col justify-center items-center w-50/100 z-50 relative">
				<div className="align-right w-full my-5">
					<p className=" text-2xl font-bold text-[#1bb1d4]">
						ثبت نام
					</p>
				</div>
				<div className="text-gray-600 text-base/7 w-full">
					<p>سلام!</p>
					<p>
						لطفا مشخصات خود را وارد کنید
					</p>
				</div>
				<div className="w-full m-6">
					{/* Phone Number */}
					<div className="flex items-center mb-4">
						<label
							htmlFor="phone-number"
							className="p-2 w-24"
						>
							شماره موبایل :
						</label>
						<input
							type="text"
							name="phone-number"
							id="phone-number"
							value={phoneOrEmail}
							onChange={(e) =>
								setPhoneOrEmail(
									e.target.value
								)
							}
							className="rounded-lg 
                            p-2
                            w-3/10
                            text-base
                            outline-none
                            bg-gray-50
                            h-12
                            border-[1px]
                            border-transparent
                            focus:border-[#048e73]
                            focus:text-gray-500
                            transition-colors
                            duration-200"
							placeholder="09123456789"
						/>
					</div>

					{/* Password */}
					<div className="flex items-center mb-4">
						<label
							htmlFor="password"
							className="p-2 w-24"
						>
							رمز عبور :
						</label>
						<input
							type="password"
							name="password"
							id="password"
							value={password}
							onChange={(e) =>
								setPassword(
									e.target.value
								)
							}
							className="rounded-lg 
                            p-2
                            w-3/10
                            text-base
                            outline-none
                            bg-gray-50
                            h-12
                            border-[1px]
                            border-transparent
                            focus:border-[#048e73]
                            focus:text-gray-500
                            transition-colors
                            duration-200"
							placeholder="رمز عبور"
						/>
					</div>

					{/* Confirm Password */}
					<div className="flex items-center mb-4">
						<label
							htmlFor="confirm-password"
							className="p-2 w-24"
						>
							تکرار رمز :
						</label>
						<input
							type="password"
							name="confirm-password"
							id="confirm-password"
							value={confirmPassword}
							onChange={(e) =>
								setConfirmPassword(
									e.target.value
								)
							}
							className="rounded-lg 
                            p-2
                            w-3/10
                            text-base
                            outline-none
                            bg-gray-50
                            h-12
                            border-[1px]
                            border-transparent
                            focus:border-[#048e73]
                            focus:text-gray-500
                            transition-colors
                            duration-200"
							placeholder="تکرار رمز عبور"
						/>
					</div>

					{/* National Code */}
					<div className="flex items-center mb-4">
						<label
							htmlFor="national-id"
							className="p-2 w-18"
						>
							کدملی :
						</label>
						<input
							type="text"
							name="national-id"
							id="national-id"
							value={nationalCode}
							onChange={(e) =>
								setNationalCode(
									e.target.value
								)
							}
							className="rounded-lg 
                            p-2
                            w-3/10
                            text-base
                            outline-none
                            bg-gray-50
                            h-12
                            border-[1px]
                            border-transparent
                            focus:border-[#048e73]
                            focus:text-gray-500
                            transition-colors
                            duration-200"
							placeholder="کد ملی"
						/>
					</div>

					{/* SHABA Number */}
					<div className="flex items-center mb-4">
						<label
							htmlFor="shaba-number"
							className=" p-2 w-26"
						>
							شماره شبا :
						</label>
						<input
							type="text"
							name="shaba-number"
							id="shaba-number"
							value={shabaNumber}
							onChange={(e) =>
								setShabaNumber(
									e.target.value
								)
							}
							className="rounded-lg 
                            p-2
                            w-4/10
                            my-2
                            text-base
                            outline-none
                            bg-gray-50
                            h-12
							border-[1px]
                            border-transparent
                            focus:border-[#048e73]
                            focus:text-gray-500
                            transition-colors
                            duration-200"
							placeholder="XXXX-XXXX-XXXX-XXXX"
						/>
					</div>

					{/* Store Name */}
					<div className="flex items-center mb-4">
						<label
							htmlFor="store-name"
							className="w-30 p-2"
						>
							نام فروشگاه :
						</label>

						<input
							type="text"
							name="store-name"
							id="store-name"
							value={storeName}
							onChange={(e) =>
								setStoreName(
									e.target.value
								)
							}
							className="rounded-lg 
                            p-2
                            w-5/10
                            text-base
                            outline-none
                            bg-gray-50
							h-12
                            border-[1px]
                            border-transparent
                            focus:border-[#048e73]
                            focus:text-gray-500
                            transition-colors
                            duration-200"
							placeholder="نام فروشگاه"
						/>
					</div>

					{/* Store Address */}
					<div className="flex items-center mt-2">
						<label
							htmlFor="address"
							className="p-2 w-18"
						>
							آدرس :
						</label>
						<textarea
							type="text"
							name="address"
							id="address"
							value={storeAddress}
							onChange={(e) =>
								setStoreAddress(
									e.target.value
								)
							}
							className="rounded-lg 
						resize-none
                            p-2
							my-2
                            w-full
                            text-base
                            outline-none
                            bg-gray-50
                            h-30
							border-[1px]
                            border-transparent
                            focus:border-[#048e73]
                            focus:text-gray-500
                            transition-colors
                            duration-200"
							placeholder="آدرس"
						/>
					</div>
				</div>
				<div className="w-full flex items-center justify-center">
					<button
						className="text-white bg-[#1bb1d4] w-8/10 rounded-lg h-12 hover:cursor-pointer disabled:bg-gray-400"
						onClick={handleVerification}
						disabled={loading}
					>
						<p>{loading ? "در حال ثبت..." : "ثبت نام"}</p>
					</button>
				</div>
				<div className="mt-6 text-[13px] font-medium">
					<p className="text-gray-500">
						ثبت نام شما به معنای پذیرش شرایط{" "}
						<span className="text-blue-500">
							دیجی کالا
						</span>{" "}
						و{" "}
						<span className="text-blue-500">
							قوانین حریم خصوصی
						</span>{" "}
						است
					</p>
				</div>
				<div className="mt-6 text-[12px] font-medium">
					<p className="text-gray-500">
						در دیجی کالا حساب دارید؟
						<span
							className="text-[#1bb1d4] font-semibold text-base cursor-pointer"
							onClick={toggleMode}
						>
							وارد شوید
						</span>
					</p>
				</div>
				<div className="absolute left-5 top-10 flex flex-col-reverse gap-4 items-center justify-center ">
					<img
						src={supportLogo}
						alt=""
						className="w-80 "
					/>
					<img
						src={digisupportLogo}
						alt=""
						className="w-30"
					/>
				</div>
			</div>
		</div>
	);
};

const LoginSeller = ({
	handleVerification,
	phoneOrEmail,
	setPhoneOrEmail,
	password,
	setPassword,
	toggleMode,
	loading
}) => {
	return (
		<div className="flex justify-center items-center w-full h-[100vh] ">
			<div className="relative border border-gray-300 rounded-2xl m-auto p-6 flex flex-col justify-center items-center w-50/100 z-50">
				<div className="content-baseline w-full my-5">
					<p className=" text-2xl font-semibold text-[#1bb1d4]">
						ورود
					</p>
				</div>
				<div className="text-gray-600 text-base/7 w-full">
					<p>سلام!</p>
					<p>
						لطفا شماره موبایل و رمز عبور خود
						را وارد کنید
					</p>
				</div>
				<div className="w-full my-6">
					<div className="flex items-center mb-4">
						<label htmlFor="phoneOrEmail" className="w-24">شماره شما :</label>
						<input
							type="text"
							name="phoneOrEmail"
							id="phoneOrEmail"
							value={phoneOrEmail}
							onChange={(e) =>
								setPhoneOrEmail(
									e.target.value
								)
							}
							className="rounded-lg 
							p-2
							text-sm
							outline-none
                            bg-gray-50
                            h-12
							border-[1px]
                            border-transparent
                            focus:border-[#048e73]
                            focus:text-gray-500
                            transition-colors
                            duration-200
							w-4/10"
							placeholder="09123456789"
						/>
					</div>
					
					<div className="flex items-center">
						<label htmlFor="password" className="w-20">رمز عبور :</label>
						<input
							type="password"
							name="password"
							id="password"
							value={password}
							onChange={(e) =>
								setPassword(
									e.target.value
								)
							}
							className="rounded-lg 
                            p-2
                            mb-2
                            mt-[1rem]
                            text-sm
                            outline-none
                            bg-gray-50
                            h-12
							border-[1px]
                            border-transparent
                            focus:border-[#048e73]
                            focus:text-gray-500
                            transition-colors
                            duration-200
							w-55/100"
							placeholder="رمز عبور"
						/>
					</div>
				</div>
				<div className="w-full flex items-base justify-baseline">
					<button
						className="text-white bg-[#1bb1d4] w-3/10 rounded-lg h-12 hover:cursor-pointer disabled:bg-gray-400"
						onClick={handleVerification}
						disabled={loading}
					>
						<p>{loading ? "در حال ورود..." : "ورود"}</p>
					</button>
				</div>

				<div className="mt-6 text-[12px] font-medium">
					<p className="text-gray-500">
						در دیجی کالا حساب ندارید؟
						<span
							className="text-[#048e73] font-semibold text-base cursor-pointer"
							onClick={toggleMode}
						>
							{" "}
							ثبت نام کنید
						</span>
					</p>
				</div>
				<div className="absolute -left-10 top-10 flex flex-col-reverse gap-4 items-center justify-center ">
					<img
						src={supportLogo}
						alt=""
						className="w-100 "
					/>
					<img
						src={digisupportLogo}
						alt=""
						className="w-30"
					/>
				</div>
			</div>
		</div>
	);
};

const SellerLoginRegisterPage = () => {
	const navigate = useNavigate();
	const [phoneOrEmail, setPhoneOrEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [nationalCode, setNationalCode] = useState("");
	const [shabaNumber, setShabaNumber] = useState("");
	const [storeName, setStoreName] = useState("");
	const [storeAddress, setStoreAddress] = useState("");
	const [mode, setMode] = useState("login");
	const [loading, setLoading] = useState(false);
	
	const toggleMode = () => {
		setMode((prev) => (prev === "login" ? "register" : "login"));
	};

	const { setAuthTokens } = useContext(AuthContext);

	const handleSubmit = async () => {
		if (!phoneOrEmail || !password) {
			alert("لطفا شماره موبایل و رمز عبور را وارد کنید");
			return;
		}

		if (mode === "register") {
			if (password !== confirmPassword) {
				alert("رمز عبور و تایید آن یکسان نیست.");
				return;
			}
			
			if (!nationalCode || !shabaNumber || !storeName || !storeAddress) {
				alert("لطفا همه فیلدهای ضروری را پر کنید");
				return;
			}
		}

		setLoading(true);

		try {
			if (mode === "register") {
				const registerResponse = await axios.post(
					"http://127.0.0.1:8000/api/auth/register/",
					{
						phone_number: phoneOrEmail,
						password: password,
						confirm_password: confirmPassword,
					}
				);

				if (registerResponse.status === 200 || registerResponse.status === 201) {
					const { access, refresh } = registerResponse.data.token;
					const tokens = { access, refresh };

					localStorage.setItem("authTokens", JSON.stringify(tokens));
					setAuthTokens(tokens);

					try {
						const sellerResponse = await axios.post(
							"http://127.0.0.1:8000/api/sellers/register/",
							{
								is_legal: true,
								national_code: nationalCode,
								shaba_number: shabaNumber,
								store_name: storeName,
								store_address: storeAddress,
							},
							{
								headers: {
									Authorization: `Bearer ${access}`,
									'Content-Type': 'application/json',
								},
							}
						);

						alert("ثبت نام با موفقیت انجام شد!");
						navigate("/seller-profile");
					} catch (sellerError) {
						console.error("Seller registration error:", sellerError);
						alert("ثبت نام کاربری موفق بود اما خطا در ثبت اطلاعات فروشنده. لطفا دوباره تلاش کنید.");
						navigate("/seller-profile");
					}
				}
			} else {
				const response = await axios.post(
					"http://127.0.0.1:8000/api/jwt/login/",
					{
						phone_number: phoneOrEmail,
						password: password,
					}
				);

				if (response.status === 200) {
					const { access, refresh } = response.data;
					const tokens = { access, refresh };

					localStorage.setItem("authTokens", JSON.stringify(tokens));
					setAuthTokens(tokens);

					navigate("/seller-profile");
				}
			}
		} catch (error) {
			console.error("API error:", error.response?.data || error.message);
			
			if (error.response?.status === 400) {
				const errorData = error.response.data;
				let errorMessage = "خطا در اطلاعات وارد شده:\n";
				
				if (errorData.phone_number) {
					errorMessage += `شماره موبایل: ${errorData.phone_number[0]}\n`;
				}
				if (errorData.password) {
					errorMessage += `رمز عبور: ${errorData.password[0]}\n`;
				}
				if (errorData.confirm_password) {
					errorMessage += `تایید رمز عبور: ${errorData.confirm_password[0]}\n`;
				}
				if (errorData.non_field_errors) {
					errorMessage += `${errorData.non_field_errors[0]}\n`;
				}
				
				alert(errorMessage);
			} else {
				alert("خطا در عملیات. لطفا بعدا تلاش کنید.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{mode === "login" ? (
				<LoginSeller
					handleVerification={handleSubmit}
					phoneOrEmail={phoneOrEmail}
					setPhoneOrEmail={setPhoneOrEmail}
					password={password}
					setPassword={setPassword}
					toggleMode={toggleMode}
					loading={loading}
				/>
			) : (
				<RegsisterSeller
					handleVerification={handleSubmit}
					phoneOrEmail={phoneOrEmail}
					setPhoneOrEmail={setPhoneOrEmail}
					password={password}
					setPassword={setPassword}
					confirmPassword={confirmPassword}
					setConfirmPassword={setConfirmPassword}
					nationalCode={nationalCode}
					setNationalCode={setNationalCode}
					shabaNumber={shabaNumber}
					setShabaNumber={setShabaNumber}
					storeName={storeName}
					setStoreName={setStoreName}
					storeAddress={storeAddress}
					setStoreAddress={setStoreAddress}
					toggleMode={toggleMode}
					loading={loading}
				/>
			)}
		</>
	);
};

export default SellerLoginRegisterPage;