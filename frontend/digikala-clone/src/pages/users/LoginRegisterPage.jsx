import { useState } from "react";
import loginLogo from "../../assets/login-logo.svg";
import { AuthContext } from "../../auth/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const RegisterUser = ({
	handleVerification,
	phoneOrEmail,
	setPhoneOrEmail,
	password,
	setPassword,
	confirmPassword,
	setConfirmPassword,
	toggleMode,
	loading
}) => {
	return (
		<div className="flex justify-center items-center w-full h-[100vh]">
			<div className="border border-gray-300 rounded-2xl m-auto p-6 flex flex-col justify-center items-center w-25/100">
				<div className="my-4">
					<img
						src={loginLogo}
						className="w-28 h-28"
						alt=""
					/>
				</div>
				<div className="flex items-center justify-center w-full my-5">
					<p className=" text-xl font-semibold">
						ثبت نام
					</p>
				</div>
				<div className="text-gray-600 text-sm/7 w-full">
					<p>سلام!</p>
					<p>
						{" "}
						لطفا شماره موبایل و رمز عبور خود
						را وارد کنید
					</p>
				</div>
				<div className="w-full m-6">
					<input
						type="text"
						name="phoneOrEmail"
						value={phoneOrEmail}
						id="phoneOrEmail"
						className="border-none rounded-lg 
                            p-2
                            w-full
                            text-sm
                            outline-none
                            bg-gray-200
                            h-10"
						placeholder="شماره شما"
						onChange={(e) =>
							setPhoneOrEmail(
								e.target.value
							)
						}
					/>
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
						className="border-none rounded-lg 
                            p-2
                            w-full
                            my-2
                            text-sm
                            outline-none
                            bg-gray-200
                            h-10"
						placeholder="رمز عبور"
					/>
					<input
						type="password"
						name="conformPassword"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) =>
							setConfirmPassword(
								e.target.value
							)
						}
						className="border-none rounded-lg 
                            p-2
                            w-full
                            text-sm
                            outline-none
                            bg-gray-200
                            h-10"
						placeholder="تایید رمز عبور"
					/>
				</div>
				<div className="w-full">
					<button
						className="text-white bg-[#ED1944] w-full rounded-lg h-12 hover:cursor-pointer disabled:bg-gray-400"
						onClick={handleVerification}
						disabled={loading}
					>
						<p>{loading ? "در حال ثبت..." : "ثبت نام"}</p>
					</button>
				</div>
				<div className="mt-6 text-[10px] font-medium">
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
							className="text-red-500 font-semibold text-base cursor-pointer"
							onClick={toggleMode}
						>
							وارد شوید
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

const LoginUser = ({
	handleVerification,
	phoneOrEmail,
	setPhoneOrEmail,
	password,
	setPassword,
	toggleMode,
	loading
}) => {
	return (
		<div className="flex justify-center items-center w-full h-[100vh]">
			<div className="border border-gray-300 rounded-2xl m-auto p-6 flex flex-col justify-center items-center w-25/100">
				<div className="my-4">
					<img
						src={loginLogo}
						className="w-28 h-28"
						alt=""
					/>
				</div>
				<div className="flex items-center justify-center w-full my-5">
					<p className=" text-xl font-semibold">
						ورود
					</p>
				</div>
				<div className="text-gray-600 text-sm/7 w-full">
					<p>سلام!</p>
					<p>
						لطفا شماره موبایل و رمز عبور خود
						را وارد کنید
					</p>
				</div>
				<div className="w-full my-6">
					<input
						type="text"
						name="phoneOrEmail"
						value={phoneOrEmail}
						id="phoneOrEmail"
						className="border-none rounded-lg 
                            p-2
                            w-full
                            text-sm
                            outline-none
                            bg-gray-200
                            h-10"
						placeholder="شماره شما"
						onChange={(e) =>
							setPhoneOrEmail(
								e.target.value
							)
						}
					/>
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
						className="border-none rounded-lg 
                            p-2
                            w-full
                            mb-2
                            mt-[1rem]
                            text-sm
                            outline-none
                            bg-gray-200
                            h-10"
						placeholder="رمز عبور"
					/>
				</div>
				<div className="w-full">
					<button
						className="text-white bg-[#ED1944] w-full rounded-lg h-12 hover:cursor-pointer disabled:bg-gray-400"
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
							className="text-red-500 font-semibold text-base cursor-pointer"
							onClick={toggleMode}
						>
							{" "}
							ثبت نام کنید
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

const LoginRegisterPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [phoneOrEmail, setPhoneOrEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
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

		if (mode === "register" && password !== confirmPassword) {
			alert("رمز عبور و تایید آن یکسان نیست.");
			return;
		}

		setLoading(true);

		try {
			if (mode === "register") {
				const response = await axios.post(
					"http://127.0.0.1:8000/api/auth/register/",
					{
						phone_number: phoneOrEmail,
						password: password,
						confirm_password: confirmPassword,
					}
				);

				if (response.status === 200 || response.status === 201) {
					const { access, refresh } = response.data.token;
					const tokens = { access, refresh };

					localStorage.setItem("authTokens", JSON.stringify(tokens));
					setAuthTokens(tokens);


					const returnTo = location.state?.returnTo;
					if (returnTo) {
						navigate(returnTo);
					} else {
						navigate("/");
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


					const returnTo = location.state?.returnTo;
					if (returnTo) {
						navigate(returnTo);
					} else {
						navigate("/");
					}
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
			} else if (error.response?.status === 401) {
				alert("شماره موبایل یا رمز عبور اشتباه است");
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
				<LoginUser
					handleVerification={handleSubmit}
					phoneOrEmail={phoneOrEmail}
					setPhoneOrEmail={setPhoneOrEmail}
					password={password}
					setPassword={setPassword}
					toggleMode={toggleMode}
					loading={loading} 
				/>
			) : (
				<RegisterUser
					handleVerification={handleSubmit}
					phoneOrEmail={phoneOrEmail}
					setPhoneOrEmail={setPhoneOrEmail}
					password={password}
					setPassword={setPassword}
					confirmPassword={confirmPassword}
					setConfirmPassword={setConfirmPassword}
					toggleMode={toggleMode}
					loading={loading}
				/>
			)}
		</>
	);
};

export default LoginRegisterPage;