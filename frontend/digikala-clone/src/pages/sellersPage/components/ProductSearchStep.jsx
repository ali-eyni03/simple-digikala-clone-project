import { useState} from "react";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { MdShoppingCart } from "react-icons/md";

const ProductSearchStep = ({ onSelectProduct, onCreateNew }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const mockProducts = [
		{
			id: 1,
			name: "لپ تاپ 17.3 اینچی ایسوس مدل TUF Gaming F17",
			description: "لپ تاپ گیمینگ قدرتمند با پردازنده Intel Core i7",
			category: "الکترونیک",
			images: ["https://dkstatics-public.digikala.com/digikala-products/3ef95f8e1c9e99c029b7f8911907a1849c9a9752_1749279092.jpg"],
			sellersCount: 3,
			minPrice: 45000000,
			maxPrice: 52000000
		},
		{
			id: 2,
			name: "گوشی موبایل سامسونگ مدل Galaxy A54",
			description: "گوشی هوشمند با دوربین 50 مگاپیکسل",
			category: "الکترونیک",
			images: ["https://dkstatics-public.digikala.com/digikala-products/3ef95f8e1c9e99c029b7f8911907a1849c9a9752_1749279092.jpg"],
			sellersCount: 7,
			minPrice: 15000000,
			maxPrice: 18000000
		},
		{
			id: 3,
			name: "کفش ورزشی نایک مدل Air Max",
			description: "کفش ورزشی مردانه مناسب برای دویدن",
			category: "پوشاک و مد",
			images: ["https://dkstatics-public.digikala.com/digikala-products/3ef95f8e1c9e99c029b7f8911907a1849c9a9752_1749279092.jpg"],
			sellersCount: 2,
			minPrice: 3500000,
			maxPrice: 4200000
		}
	];

	// Search function
	const handleSearch = async () => {
		if (!searchQuery.trim()) return;
		
		setLoading(true);
		setTimeout(() => {
			const results = mockProducts.filter(product => 
				product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setSearchResults(results);
			setLoading(false);
		}, 500);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat('fa-IR').format(price);
	};

	const handleSelectProduct = (product) => {
		setSelectedProduct(product);
		onSelectProduct(product);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">جستجوی محصول</h2>
				<p className="text-gray-600">محصول مورد نظر خود را جستجو کنید یا محصول جدید ایجاد کنید</p>
			</div>

			{/* Search Box */}
			<div className="bg-gray-50 p-6 rounded-lg border">
				<div className="flex gap-3">
					<div className="flex-1 relative">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="نام محصول، برند یا مدل را وارد کنید..."
							className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
						/>
						<FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
					</div>
					<button
						onClick={handleSearch}
						disabled={loading || !searchQuery.trim()}
						className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
					>
						{loading ? "در حال جستجو..." : "جستجو"}
					</button>
				</div>
			</div>

			{/* Search Results */}
			{searchResults.length > 0 && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-gray-800">
							نتایج جستجو ({searchResults.length} محصول)
						</h3>
						<button
							onClick={() => setSearchResults([])}
							className="text-gray-500 hover:text-gray-700"
						>
							<FaTimes />
						</button>
					</div>

					<div className="grid gap-4">
						{searchResults.map((product) => (
							<div
								key={product.id}
								className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
									selectedProduct?.id === product.id
										? 'border-blue-500 bg-blue-50'
										: 'border-gray-200 hover:border-gray-300'
								}`}
								onClick={() => handleSelectProduct(product)}
							>
								<div className="flex gap-4">
									{/* Product Image */}
									<div className="w-20 h-20 flex-shrink-0">
										<img
											src={product.images[0]}
											alt={product.name}
											className="w-full h-full object-cover rounded-lg"
										/>
									</div>

									{/* Product Info */}
									<div className="flex-1 min-w-0">
										<h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
										<p className="text-sm text-gray-600 mt-1 line-clamp-2">
											{product.description}
										</p>
										<div className="flex items-center gap-4 mt-2 text-sm">
											<span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
												{product.category}
											</span>
											<span className="text-blue-600 flex items-center gap-1">
												<MdShoppingCart size={16} />
												{product.sellersCount} فروشنده
											</span>
										</div>
									</div>

									{/* Price Range */}
									<div className="text-left">
										<div className="text-sm text-gray-500">قیمت از:</div>
										<div className="font-semibold text-green-600">
											{formatPrice(product.minPrice)} تومان
										</div>
										{product.minPrice !== product.maxPrice && (
											<div className="text-xs text-gray-500">
												تا {formatPrice(product.maxPrice)} تومان
											</div>
										)}
									</div>

									{/* Selection Indicator */}
									{selectedProduct?.id === product.id && (
										<div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full">
											✓
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* No Results */}
			{searchResults.length === 0 && searchQuery && !loading && (
				<div className="text-center py-8">
					<div className="text-gray-400 mb-4">
						<MdShoppingCart size={48} className="mx-auto" />
					</div>
					<h3 className="text-lg font-semibold text-gray-600 mb-2">
						محصولی یافت نشد
					</h3>
					<p className="text-gray-500 mb-4">
						محصول مورد نظر شما در سیستم وجود ندارد
					</p>
				</div>
			)}

			{/* Action Buttons */}
			<div className="flex gap-4 pt-6 border-t">
				{selectedProduct ? (
					<button
						onClick={() => onSelectProduct(selectedProduct)}
						className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
					>
						<MdShoppingCart />
						افزودن این محصول به فروشگاه من
					</button>
				) : (
					<div className="flex gap-4 w-full">
						<button
							onClick={onCreateNew}
							className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
						>
							<FaPlus />
							ایجاد محصول جدید
						</button>
						{searchQuery && (
							<button
								onClick={handleSearch}
								className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								جستجوی مجدد
							</button>
						)}
					</div>
				)}
			</div>

			{/* Helper Text */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h4 className="font-semibold text-blue-800 mb-2">راهنما:</h4>
				<ul className="text-sm text-blue-700 space-y-1">
					<li>• اگر محصول مورد نظر شما موجود است، آن را انتخاب کنید</li>
					<li>• شما می‌توانید قیمت و موجودی خود را برای آن محصول تعین کنید</li>
					<li>• اگر محصول جدیدی است، "ایجاد محصول جدید" را کلیک کنید</li>
				</ul>
			</div>
		</div>
	);
};

export default ProductSearchStep;