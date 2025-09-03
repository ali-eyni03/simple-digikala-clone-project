import "swiper/css";
import "swiper/css/pagination";
import { IoMdAdd } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import { CiMenuKebab } from "react-icons/ci";

const AddressAddSection = () => {
	return (
		<div className="w-full border rounded-lg border-gray-200 shadow-lg p-4 m-4 bg-white">
			<div className="flex justify-between px-5">
				<div className="border-b-2 border-red-500 flex items-center justify-center p-2">
					<p className="font-semibold text-lg">
						آدرس ها
					</p>
				</div>
				<div className="flex items-center justify-center gap-2 text-red-700 font-medium px-4">
					<p>افزودن آدرس جدید</p>
					<IoMdAdd />
				</div>
			</div>
			<div className="border-2 rounded-lg border-blue-400 mx-2 m-auto my-3 grid grid-cols-12 gap-1 text-base text-gray-600 py-4">
				<div className="flex items-baseline justify-center">
					<GrLocation className="w-6 h-6 text-blue-400"/>
				</div>
				<div className="col-span-10 pb-2">
		  <div className="flex flex-col gap-1">
			<div className="text-blue-400">خیابان اول خیابان دوم خیابان سوم</div>
			<div>کد پستی : 778844555</div>
			<div>گیرنده:‌علی عینی|۰۹۱۱۱۱۱۱۱۱۱</div>
		  </div>
		</div>
				<div className="flex items-baseline justify-center ">
					<CiMenuKebab  className="w-6 h-6"/>
				</div>
			</div>
		</div>
	);
};

const SellerAddress = () => {
	return (
		<AddressAddSection/>
	);
};
export default SellerAddress;
