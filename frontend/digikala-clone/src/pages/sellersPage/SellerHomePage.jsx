import SellerNavbar from "./components/SellerNavbar";
import Footer from "../../components/Footer";
import sellerLanding from "../../assets/seller-landing.png";
import iranMapBorder from "../../assets/iran-map-border.png";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

const SellerHomePage = () => {
	const texts = [
		"تنها در دیجی کالا به همه نقاط ایران بفروشید",
		"با دیجی‌کالا کسب‌وکار خود را گسترش دهید",
		"فروش آنلاین آسان با دیجی‌کالا",
		"با دیجی‌کالا به میلیون‌ها مشتری دسترسی داشته باشید",
	];

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setIsVisible(false); 

			setTimeout(() => {
				setCurrentIndex((prevIndex) =>
					prevIndex === texts.length - 1 ? 0 : prevIndex + 1
				);
				setIsVisible(true); 
			}, 500); 
		}, 5000);

		return () => clearInterval(interval);
	}, []);
	return (
		<div>
			<SellerNavbar />
			<div className="w-full">
				<img
					src={sellerLanding}
					alt=""
					className="w-full"
				/>
				<div className="bg-gradient-to-t from-[#991731]/50 to-white/0 w-full h-70 absolute bottom-[-1rem] ">
					<div className="absolute right-40 text-white">
						<div className="">
							<h1 className="text-5xl font-bold text-shadow-lg/60 my-2">
								در دیجی کالا
								فروشنده شوید!
							</h1>
						</div>
						<div className={`mt-6 p-3 font-semibold text-xl transition-opacity text-shadow-lg/70 duration-500 ${
				isVisible ? "opacity-100" : "opacity-0"
			}`}>
							{texts[currentIndex]}
						</div>
						<div>
							<Link to="/seller-register" className="w-[14rem] bg-red-800 rounded-lg p-2 my-2 font-semibold">
								ثبت نام فروشنده
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-[#991731] overflow-hidden flex items-center w-[97%] mx-auto rounded-4xl relative bottom-15">
				<img
					className="relative top-25 left-20  w-[36rem] h-[36rem] opacity-20"
					src={iranMapBorder}
					alt=""
				/>
				<div className="absolute flex items-center justify-between  w-full z-10 ">
					<div className="relative font-bold text-white top-4 right-50 p-4">
						<p className="text-3xl ">
							چرا در دیجی کالا
							بفروشیم؟
						</p>
						<p className="mt-4">
							از زبان فروشنده ها
						</p>
					</div>
					<div className="relative left-40">
						<video
							className="w-[45rem] rounded-3xl"
							src="https://digikala.arvanvod.ir/kGp7mgrY8V/0anplEQJ9N/h_1080_4500k.mp4"
							type="video/mp4"
							controls
						></video>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};
export default SellerHomePage;
