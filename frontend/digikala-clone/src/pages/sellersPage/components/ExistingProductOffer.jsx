import { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { MdWarning } from "react-icons/md";

const ExistingProductOffer = ({ selectedProduct, onBack, onSubmit }) => {
	const [formData, setFormData] = useState({
		price: "",
		discountPrice: "",
		stock: "",
		condition: "new", 
		warranty: "",
		description: "",
		shippingTime: "1-3",
		variants: []
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	const inputClasses = "bg-gray-50 w-full rounded-lg h-10 outline-none border-2 border-transparent focus:border-blue-400 focus:text-gray-700 transition-colors duration-200 px-3";
	const textareaClasses = "bg-gray-50 w-full rounded-lg outline-none border-2 border-transparent focus:border-blue-400 focus:text-gray-700 transition-colors duration-200 px-3 py-2 resize-none";

	const handleInputChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
		
		if (errors[field]) {
			setErrors(prev => ({
				...prev,
				[field]: ""
			}));
		}
	};

	const calculateDiscountPercent = () => {
		if (formData.price && formData.discountPrice) {
			const discount = ((formData.price - formData.discountPrice) / formData.price) * 100;
			return Math.round(discount);
		}
		return 0;
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat('fa-IR').format(price);
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.price) newErrors.price = "قیمت الزامی است";
		else if (formData.price <= 0) newErrors.price = "قیمت باید بیشتر از صفر باشد";

		if (!formData.stock) newErrors.stock = "موجودی الزامی است";
		else if (formData.stock <= 0) newErrors.stock = "موجودی باید بیشتر از صفر باشد";

		if (formData.discountPrice && formData.discountPrice >= formData.price) {
			newErrors.discountPrice = "قیمت تخفیف باید کمتر از قیمت اصلی باشد";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setLoading(true);
		
		try {
			const offerData = {
				productId: selectedProduct.id,
				...formData,
				discountPercent: calculateDiscountPercent()
			};
			
			await onSubmit(offerData);
		} catch (error) {
			console.error("Error submitting offer:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<button
					onClick={onBack}
					className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<FaArrowLeft />
				</button>
				<div>
					<h2 className="text-2xl font-bold text-gray-800">افزودن پیشنهاد فروش</h2>
					<p className="text-gray-600">قیمت و شرایط فروش خود را برای این محصول تعین کنید</p>
				</div>
			</div>

			{/* Selected Product Info */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex gap-4">
					<img
						src={selectedProduct.images[0]}
						alt={selectedProduct.name}
						className="w-16 h-16 object-cover rounded-lg"
					/>
					<div>
						<h3 className="font-semibold text-gray-800">{selectedProduct.name}</h3>
						<p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
						<div className="flex items-center gap-2 mt-2 text-sm">
							<span className="bg-white px-2 py-1 rounded text-gray-700">
								{selectedProduct.category}
							</span>
							<span className="text-blue-600">
								{selectedProduct.sellersCount} فروشنده دیگر
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Pricing Section */}
			<div className="bg-white border border-gray-200 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">قیمت گذاری</h3>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							قیمت فروش (تومان) *
						</label>
						<input
							type="number"
							value={formData.price}
							onChange={(e) => handleInputChange('price', e.target.value)}
							className={inputClasses}
							placeholder="قیمت فروش شما"
						/>
						{errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
						
						{/* Price comparison */}
						{selectedProduct.minPrice && formData.price && (
							<div className="mt-2 text-sm">
								{formData.price < selectedProduct.minPrice ? (
									<span className="text-green-600">✓ قیمت شما کمترین قیمت است</span>
								) : formData.price > selectedProduct.maxPrice ? (
									<span className="text-red-600">⚠ قیمت شما بالاتر از سایر فروشندگان است</span>
								) : (
									<span className="text-orange-600">قیمت شما در محدوده رقابتی است</span>
								)}
							</div>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							قیمت با تخفیف (تومان)
						</label>
						<input
							type="number"
							value={formData.discountPrice}
							onChange={(e) => handleInputChange('discountPrice', e.target.value)}
							className={inputClasses}
							placeholder="قیمت پس از تخفیف (اختیاری)"
						/>
						{errors.discountPrice && <p className="text-red-500 text-xs mt-1">{errors.discountPrice}</p>}
						
						{/* Discount percentage */}
						{calculateDiscountPercent() > 0 && (
							<div className="mt-2 text-sm text-green-600">
								تخفیف: {calculateDiscountPercent()}%
							</div>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							موجودی انبار *
						</label>
						<input
							type="number"
							value={formData.stock}
							onChange={(e) => handleInputChange('stock', e.target.value)}
							className={inputClasses}
							placeholder="تعداد موجودی"
						/>
						{errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							وضعیت محصول
						</label>
						<select
							value={formData.condition}
							onChange={(e) => handleInputChange('condition', e.target.value)}
							className={inputClasses}
						>
							<option value="new">نو</option>
							<option value="used">دست دوم</option>
							<option value="refurbished">بازسازی شده</option>
						</select>
					</div>
				</div>
			</div>

			{/* Additional Details */}
			<div className="bg-white border border-gray-200 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">جزئیات اضافی</h3>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							مدت گارانتی (ماه)
						</label>
						<input
							type="number"
							value={formData.warranty}
							onChange={(e) => handleInputChange('warranty', e.target.value)}
							className={inputClasses}
							placeholder="مدت گارانتی"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							زمان ارسال
						</label>
						<select
							value={formData.shippingTime}
							onChange={(e) => handleInputChange('shippingTime', e.target.value)}
							className={inputClasses}
						>
							<option value="1-3">1 تا 3 روز کاری</option>
							<option value="3-7">3 تا 7 روز کاری</option>
							<option value="7-14">7 تا 14 روز کاری</option>
							<option value="14+">بیش از 14 روز</option>
						</select>
					</div>
				</div>

				<div className="mt-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						توضیحات اضافی
					</label>
					<textarea
						rows={4}
						value={formData.description}
						onChange={(e) => handleInputChange('description', e.target.value)}
						className={textareaClasses}
						placeholder="توضیحات اضافی درباره محصول، شرایط فروش، یا ویژگی های خاص..."
					/>
				</div>
			</div>

			{/* Warning */}
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<div className="flex gap-3">
					<MdWarning className="text-yellow-600 mt-0.5" size={20} />
					<div>
						<h4 className="font-semibold text-yellow-800">توجه:</h4>
						<ul className="text-sm text-yellow-700 mt-1 space-y-1">
							<li>• قیمت و شرایط شما در کنار سایر فروشندگان نمایش داده خواهد شد</li>
							<li>• مشتریان بر اساس قیمت، زمان ارسال و امتیاز فروشنده انتخاب می‌کنند</li>
							<li>• اطمینان حاصل کنید که محصول شما کیفیت مناسب دارد</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-4 pt-6 border-t">
				<button
					onClick={onBack}
					className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
				>
					بازگشت
				</button>
				<button
					onClick={handleSubmit}
					disabled={loading}
					className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
				>
					{loading ? (
						"در حال ثبت..."
					) : (
						<>
							<FaCheckCircle />
							ثبت پیشنهاد فروش
						</>
					)}
				</button>
			</div>
		</div>
	);
};

export default ExistingProductOffer;