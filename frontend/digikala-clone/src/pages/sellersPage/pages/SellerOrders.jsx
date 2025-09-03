import { FaAngleLeft } from "react-icons/fa";
import statusReturned from "../../../assets/status-returned.svg";
import statusDeliverd from "../../../assets/status-delivered.svg";
import statusProcessing from "../../../assets/status-processing.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { RiShoppingCartLine } from "react-icons/ri";

function CardItem() {
	return (
		<div
			className="
        w-full max-w-[820px] mx-auto"
		>
			<Swiper
				modules={[Pagination]}
				centeredSlides={false}
				slideToClickedSlide={true}
				dir="rtl"
				spaceBetween={16} 
				breakpoints={{
					1920: {
						slidesPerView: 4,
					},
					1028: {
						slidesPerView: 4,
					},
					768: {
						slidesPerView: 2,
					},
					320: {
						slidesPerView: 1,
					},
				}}
			>
				{[
					1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
					13, 14, 15, 16,
				].map((num) => (
					<SwiperSlide key={num}>
						<Link
							to={`/product/123`}
							target="_blank"
							className="bg-white flex flex-col justify-between items-center w-full h-88"
						>
							<div className="p-1">
								<img
									src="https://dkstatics-public.digikala.com/digikala-products/3ef95f8e1c9e99c029b7f8911907a1849c9a9752_1749279092.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80"
									alt=""
									className="object-contain"
								/>
							</div>
							<div className="text-sm w-full text-gray-700 flex justify-center px-2">
								<p>
									لپ تاپ
									17.3
									اینچی
									ایسوس
									مدل TUF
									Gaming
									F17 ....
								</p>
							</div>
							<div className="flex justify-between items-center ">
								<div className="text-xs flex">
									<div className="font-semibold">
										<p className="text-base">
											۱۰۴,۴۹۹,۰۰۰
										</p>
										<p className="text-gray-400 line-through text-[10px] flex justify-end">
											۱۰۷,۴۹۹,۰۰۰
										</p>
									</div>
									<p className="relative right-3 top-1.5 font-semibold">
										تومان
									</p>
								</div>
							</div>
							<div className="flex items-center justify-between text-red-500 p-2 rounded-lg border border-red-500 text-sm my-4 w-[80%] m-auto">
								<div>
									<p>
										اضافه
										به
										سبد
										خرید
									</p>
								</div>
								<div>
									<RiShoppingCartLine />
								</div>
							</div>
						</Link>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
const SellerOrders = () => {
	return (
		<div className="my-6 ">
			<div className="verify-identity flex items-center justify-between border rounded-lg p-3 border-gray-200">
				<div className="flex items-center justify-center flex-row-reverse gap-4 text-[14px]">
					<div className="text-[#f9a91f]">
						با تایید هویت می‌توانید‌ امنیت
						حساب کاربری‌تان را افزایش دهید و
						از امکان «خرید اعتباری» نیز
						استفاده کنید
					</div>
					<div className="icon bg-[#f9a91f] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
						i
					</div>
				</div>
				<div className="flex items-center justify-center text-blue-500 font-medium text-sm">
					<span>تایید هویت</span>
					<span>
						<FaAngleLeft />
					</span>
				</div>
			</div>
			{/* user orders */}
			<div className="p-2 border rounded-lg border-gray-200 my-4">
				<div className="flex items-center justify-between my-8 px-2">
					<div className="font-semibold text-lg ">
						<p>سفارش های من</p>
					</div>
					<div className="flex items-center justify-center text-blue-500 font-medium text-sm">
						<span>مشاهده همه</span>
						<span>
							<FaAngleLeft />
						</span>
					</div>
				</div>
				<div className="flex items-center justify-between w-[90%] mx-auto my-4">
					<div className="flex items-center justify-center gap-2">
						<img
							src={statusProcessing}
							alt=""
							className="w-18 h-18"
						/>
						<div className="flex items-center flex-col">
							<div className="text-lg font-medium">
								۰ سفارش
							</div>
							<div className="text-[12px] font-medium w-full text-right px-2">
								{" "}
								جاری
							</div>
						</div>
					</div>
					<div className="flex items-center justify-center gap-2">
						<img
							src={statusDeliverd}
							alt=""
							className="w-18 h-18"
						/>
						<div className="flex items-center flex-col">
							<div className="text-lg font-medium">
								۲ سفارش
							</div>
							<div className="text-[12px] font-medium w-full text-right px-2">
								تحویل شده
							</div>
						</div>
					</div>
					<div className="flex items-center justify-center gap-2">
						<img
							src={statusReturned}
							alt=""
							srcset=""
							className="w-18 h-18"
						/>
						<div className="flex items-center flex-col ">
							<div className="text-lg font-medium">
								۰ سفارش
							</div>
							<div className="text-[12px] font-medium w-full text-right px-2">
								مرجوع شده
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* user list */}
			<div className="p-2 border rounded-lg border-gray-200 my-4">
				<div className="flex items-center justify-between my-8 px-2">
					<div className="font-semibold text-lg ">
						<p>از لیست های شما</p>
					</div>
					<div className="flex items-center justify-center text-blue-500 font-medium text-sm">
						<span>مشاهده همه</span>
						<span>
							<FaAngleLeft />
						</span>
					</div>
				</div>
				<CardItem />
			</div>
			{/* most bought goods */}
			<div className="p-2 border rounded-lg border-gray-200 my-4">
				<div className="flex items-center justify-between my-8 px-2">
					<div className="font-semibold text-lg ">
						<p>خرید های پرتکرار شما</p>
					</div>
					<div className="flex items-center justify-center text-blue-500 font-medium text-sm">
						<span>مشاهده همه</span>
						<span>
							<FaAngleLeft />
						</span>
					</div>
				</div>
				<div className="mx-4">
					<CardItem />
				</div>
			</div>
		</div>
	);
};

export default SellerOrders;
