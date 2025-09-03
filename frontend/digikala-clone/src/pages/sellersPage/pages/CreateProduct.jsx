import { useState, useEffect, useContext } from "react";
import {
	FaPlus,
	FaTimes,
	FaSearch,
	FaArrowLeft,
	FaCheckCircle,
} from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit, MdShoppingCart, MdWarning } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../../auth/AuthContext";

const CreateProduct = () => {
	const [selectedExistingProduct, setSelectedExistingProduct] = useState(null);
	const { authTokens } = useContext(AuthContext);
	const [currentWorkflow, setCurrentWorkflow] = useState("search");
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [offerData, setOfferData] = useState({
		price: "",
		discountPrice: "",
		stock: "",
		condition: "new",
		warranty: "",
		description: "",
		shippingTime: "1-3",
	});
	const [offerErrors, setOfferErrors] = useState({});
	const [currentStep, setCurrentStep] = useState(1);
	const [productName, setProductName] = useState("");
	const [productDescription, setProductDescription] = useState("");
	const [category, setCategory] = useState("");
	const [subcategory, setSubcategory] = useState("");
	const [brand, setBrand] = useState("");
	const [model, setModel] = useState("");
	const [basePrice, setBasePrice] = useState("");
	const [discountPrice, setDiscountPrice] = useState("");
	const [discountPercent, setDiscountPercent] = useState("");
	const [stock, setStock] = useState("");
	const [sku, setSku] = useState("");
	const [weight, setWeight] = useState("");
	const [dimensions, setDimensions] = useState({
		length: "",
		width: "",
		height: "",
	});
	const [productImages, setProductImages] = useState([]);
	const [modalImage, setModalImage] = useState(null);
	const [attributes, setAttributes] = useState([]);
	const [newAttribute, setNewAttribute] = useState({
		name: "",
		value: "",
	});
	const [variants, setVariants] = useState([]);
	const [newVariant, setNewVariant] = useState({
		type: "",
		value: "",
		price: "",
		stock: "",
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState([]);
	const inputClasses =
		"bg-gray-50 w-full rounded-lg h-10 outline-none border-2 border-transparent focus:border-blue-400 focus:text-gray-700 transition-colors duration-200 px-3";
	const textareaClasses =
		"bg-gray-50 w-full rounded-lg outline-none border-2 border-transparent focus:border-blue-400 focus:text-gray-700 transition-colors duration-200 px-3 py-2 resize-none";
	const [categoriesLoading, setCategoriesLoading] = useState(false);
	const [categoriesError, setCategoriesError] = useState(null);
	const [subcategories, setSubcategories] = useState([]);
	const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		setCategoriesLoading(true);
		setCategoriesError(null);
		try {
			const response = await axios.get(
				"http://127.0.0.1:8000/api/products/categories/",
				{
					headers: {
						Authorization: `Bearer ${authTokens?.access}`,
					},
				}
			);
			setCategories(response.data);
		} catch (error) {
			console.error("Error loading categories:", error);
			setCategoriesError("خطا در بارگذاری دسته‌بندی‌ها");
			setCategories([]);
		} finally {
			setCategoriesLoading(false);
		}
	};

	const loadSubcategories = async (categoryId) => {
		if (!categoryId) {
			setSubcategories([]);
			return;
		}

		setSubcategoriesLoading(true);
		try {
			const response = await axios.get(
				`http://127.0.0.1:8000/api/products/categories/${categoryId}/subcategories/`,
				{
					headers: {
						Authorization: `Bearer ${authTokens?.access}`,
					},
				}
			);
			setSubcategories(response.data);
		} catch (error) {
			console.error("Error loading subcategories:", error);
			setSubcategories([]);
		} finally {
			setSubcategoriesLoading(false);
		}
	};

	const handleCategoryChange = (selectedCategoryName) => {
	setCategory(selectedCategoryName);
	setSubcategory("");
	
	getSubcategoriesFromCategory(selectedCategoryName);
};
	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		setSearchLoading(true);
		try {
			const response = await axios.get(
				"http://127.0.0.1:8000/api/products/search/",
				{
					params: { q: searchQuery },
					headers: {
						Authorization: `Bearer ${authTokens?.access}`,
					},
				}
			);
			setSearchResults(response.data);
		} catch (error) {
			console.error("Search error:", error);
			alert("خطا در جستجو");
			setSearchResults([]);
		} finally {
			setSearchLoading(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat("fa-IR").format(price);
	};

	const handleSelectExistingProduct = (product) => {
		setSelectedExistingProduct(product);
		setCurrentWorkflow("existing-offer");
	};

	const handleOfferInputChange = (field, value) => {
		setOfferData((prev) => ({ ...prev, [field]: value }));
		if (offerErrors[field]) {
			setOfferErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const calculateOfferDiscountPercent = () => {
		if (offerData.price && offerData.discountPrice) {
			const discount =
				((offerData.price - offerData.discountPrice) /
					offerData.price) *
				100;
			return Math.round(discount);
		}
		return 0;
	};

	const validateOfferForm = () => {
		const newErrors = {};
		if (!offerData.price) newErrors.price = "قیمت الزامی است";
		else if (offerData.price <= 0)
			newErrors.price = "قیمت باید بیشتر از صفر باشد";
		if (!offerData.stock) newErrors.stock = "موجودی الزامی است";
		else if (offerData.stock <= 0)
			newErrors.stock = "موجودی باید بیشتر از صفر باشد";
		if (
			offerData.discountPrice &&
			offerData.discountPrice >= offerData.price
		) {
			newErrors.discountPrice =
				"قیمت تخفیف باید کمتر از قیمت اصلی باشد";
		}
		setOfferErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleOfferSubmit = async () => {
		if (!validateOfferForm()) return;

		setLoading(true);
		try {
			const submitData = {
				product_base_id: selectedExistingProduct.id,
				price: parseFloat(offerData.price),
				discount_price: offerData.discountPrice
					? parseFloat(offerData.discountPrice)
					: null,
				stock: parseInt(offerData.stock),
				condition: offerData.condition,
				warranty: offerData.warranty
					? parseInt(offerData.warranty)
					: null,
				description: offerData.description,
				shipping_time: offerData.shippingTime,
			};

			await axios.post(
				"http://127.0.0.1:8000/api/products/offer/create/",
				submitData,
				{
					headers: {
						Authorization: `Bearer ${authTokens?.access}`,
					},
				}
			);

			alert("پیشنهاد شما با موفقیت ثبت شد!");
			handleBackToSearch();
		} catch (error) {
			console.error("Error submitting offer:", error);
			alert("خطا در ثبت پیشنهاد");
		} finally {
			setLoading(false);
		}
	};

	const handleImageUpload = (event) => {
		const files = Array.from(event.target.files);
		files.forEach((file) => {
			if (file && file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const newImage = {
						id: Date.now() + Math.random(),
						file: file,
						url: e.target.result,
						name: file.name,
						isMain:
							productImages.length ===
							0,
					};
					setProductImages((prev) => [
						...prev,
						newImage,
					]);
				};
				reader.readAsDataURL(file);
			}
		});
	};

	const removeImage = (imageId) => {
		setProductImages((prev) => {
			const filtered = prev.filter(
				(img) => img.id !== imageId
			);
			if (filtered.length > 0) {
				const hasMain = filtered.some(
					(img) => img.isMain
				);
				if (!hasMain) {
					filtered[0].isMain = true;
				}
			}
			return filtered;
		});
	};

	const setMainImage = (imageId) => {
		setProductImages((prev) =>
			prev.map((img) => ({
				...img,
				isMain: img.id === imageId,
			}))
		);
	};

	const addAttribute = () => {
		if (newAttribute.name && newAttribute.value) {
			setAttributes((prev) => [
				...prev,
				{ ...newAttribute, id: Date.now() },
			]);
			setNewAttribute({ name: "", value: "" });
		}
	};

	const removeAttribute = (id) => {
		setAttributes((prev) => prev.filter((attr) => attr.id !== id));
	};

	const addVariant = () => {
		if (newVariant.type && newVariant.value) {
			setVariants((prev) => [
				...prev,
				{ ...newVariant, id: Date.now() },
			]);
			setNewVariant({
				type: "",
				value: "",
				price: "",
				stock: "",
			});
		}
	};

	const removeVariant = (id) => {
		setVariants((prev) =>
			prev.filter((variant) => variant.id !== id)
		);
	};

	const calculateDiscountPercent = () => {
		if (basePrice && discountPrice) {
			const discount =
				((basePrice - discountPrice) / basePrice) * 100;
			setDiscountPercent(Math.round(discount));
		}
	};

	const validateStep = (step) => {
		const newErrors = {};
		switch (step) {
			case 1:
				if (!productName)
					newErrors.productName =
						"نام محصول الزامی است";
				if (!category)
					newErrors.category =
						"انتخاب دسته بندی الزامی است";
				if (!productDescription)
					newErrors.productDescription =
						"توضیحات محصول الزامی است";
				break;
			case 2:
				if (!basePrice)
					newErrors.basePrice =
						"قیمت پایه الزامی است";
				if (!stock)
					newErrors.stock =
						"موجودی انبار الزامی است";
				break;
			case 3:
				if (productImages.length === 0)
					newErrors.images =
						"حداقل یک تصویر الزامی است";
				break;
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const nextStep = () => {
		if (validateStep(currentStep) && currentStep < 4) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

const handleSubmit = async () => {
	if (!validateStep(currentStep)) return;

	setLoading(true);
	try {
		const selectedCategory = categories.find(cat => cat.name === category);
		const categoryId = selectedCategory ? selectedCategory.id : null;

		if (!categoryId) {
			alert("لطفاً دسته بندی معتبر انتخاب کنید");
			setLoading(false);
			return;
		}

		let subcategoryId = null;
		if (subcategory) {
			const selectedSubcategory = subcategories.find(sub => sub.name === subcategory);
			subcategoryId = selectedSubcategory ? selectedSubcategory.id : null;
		}

		const formData = new FormData();
		
		formData.append('name', productName);
		formData.append('description', productDescription);
		formData.append('price', parseFloat(basePrice));
		formData.append('stock', parseInt(stock));
		formData.append('category_id', categoryId);
		
		if (subcategoryId) {
			formData.append('subcategory_id', subcategoryId);
		}
		
		if (brand) formData.append('brand', brand);
		if (model) formData.append('model', model);
		if (sku) formData.append('sku', sku);
		if (weight) formData.append('weight', parseFloat(weight));
		
		if (dimensions.length || dimensions.width || dimensions.height) {
			formData.append('dimensions', JSON.stringify(dimensions));
		}
		if (attributes.length > 0) {
			const attributesObj = {};
			attributes.forEach(attr => {
				attributesObj[attr.name] = attr.value;
			});
			formData.append('attributes', JSON.stringify(attributesObj));
		}
		productImages.forEach((image, index) => {
			formData.append('images', image.file);
			formData.append(`images[${index}].alt_text`, image.name || productName);
			formData.append(`images[${index}].is_featured`, image.isMain.toString());
		});
		if (variants.length > 0) {
			variants.forEach((variant, index) => {
				const variantAttributes = {};
				variantAttributes[variant.type] = variant.value;
				if (variant.price) variantAttributes.price = parseFloat(variant.price);
				if (variant.stock) variantAttributes.stock = parseInt(variant.stock);
				
				formData.append(`variants[${index}].attributes`, JSON.stringify(variantAttributes));
			});
		}
		

		const response = await axios.post('http://127.0.0.1:8000/api/products/create/', formData, {
			headers: {
				Authorization: `Bearer ${authTokens?.access}`,
				'Content-Type': 'multipart/form-data',
			},
		});

		alert("محصول با موفقیت ایجاد شد!");
		handleBackToSearch();
	} catch (error) {
		console.error("Error creating product:", error);
		console.error("Error response:", error.response?.data);
		
		if (error.response?.status === 401) {
			alert("جلسه شما منقضی شده است. لطفاً مجدداً وارد شوید");
		} else if (error.response?.data?.detail) {
			alert(error.response.data.detail);
		} else {
			alert("خطا در ایجاد محصول. لطفاً دوباره تلاش کنید.");
		}
	} finally {
		setLoading(false);
	}
};
	const handleBackToSearch = () => {
		setCurrentWorkflow("search");
		setSelectedExistingProduct(null);
		setOfferData({
			price: "",
			discountPrice: "",
			stock: "",
			condition: "new",
			warranty: "",
			description: "",
			shippingTime: "1-3",
		});
		setOfferErrors({});
		setCurrentStep(1);
		setProductName("");
		setProductDescription("");
		setCategory("");
		setSubcategory("");
		setBrand("");
		setModel("");
		setBasePrice("");
		setDiscountPrice("");
		setStock("");
		setSku("");
		setWeight("");
		setDimensions({ length: "", width: "", height: "" });
		setProductImages([]);
		setAttributes([]);
		setVariants([]);
		setErrors({});
	};

	const handleCreateNewProduct = () => {
		setCurrentWorkflow("new-product");
	};

	const StepIndicator = ({ step, title, isActive, isCompleted }) => (
		<div className="flex items-center gap-3">
			<div
				className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
					isActive
						? "bg-blue-500 text-white"
						: isCompleted
						? "bg-green-500 text-white"
						: "bg-gray-200 text-gray-600"
				}`}
			>
				{isCompleted ? "✓" : step}
			</div>
			<span
				className={`text-sm font-medium ${
					isActive
						? "text-blue-500"
						: "text-gray-600"
				}`}
			>
				{title}
			</span>
		</div>
	);

	const reloadCategories = () => {
		loadCategories();
	};

const getSubcategoriesFromCategory = (selectedCategoryName) => {
	if (!selectedCategoryName || !categories.length) {
		setSubcategories([]);
		return;
	}
	
	const selectedCategoryObj = categories.find(cat => cat.name === selectedCategoryName);
	if (selectedCategoryObj && selectedCategoryObj.children) {
		setSubcategories(selectedCategoryObj.children);
	} else {
		setSubcategories([]);
	}
};

	{
		categoriesError && (
			<div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
				<div className="flex items-center gap-2">
					<span className="text-red-600">⚠️</span>
					<span className="text-red-700 text-sm">
						{categoriesError}
					</span>
					<button
						onClick={reloadCategories}
						className="ml-auto text-red-600 hover:text-red-800 underline text-sm"
					>
						تلاش مجدد
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white p-6 rounded-lg shadow-lg mt-4 border border-gray-200 max-w-6xl mx-auto">
			{/* === SEARCH WORKFLOW === */}
			{currentWorkflow === "search" && (
				<div className="space-y-6">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-gray-800 mb-2">
							جستجوی محصول
						</h2>
						<p className="text-gray-600">
							محصول مورد نظر خود را
							جستجو کنید یا محصول جدید
							ایجاد کنید
						</p>
					</div>

					{/* Search Box */}
					<div className="bg-gray-50 p-6 rounded-lg border">
						<div className="flex gap-3">
							<div className="flex-1 relative">
								<input
									type="text"
									value={
										searchQuery
									}
									onChange={(
										e
									) =>
										setSearchQuery(
											e
												.target
												.value
										)
									}
									onKeyPress={
										handleKeyPress
									}
									placeholder="نام محصول، برند یا مدل را وارد کنید..."
									className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
								/>
								<FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
							</div>
							<button
								onClick={
									handleSearch
								}
								disabled={
									searchLoading ||
									!searchQuery.trim()
								}
								className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
							>
								{searchLoading
									? "در حال جستجو..."
									: "جستجو"}
							</button>
						</div>
					</div>

					{/* Search Results */}
					{searchResults.length > 0 && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-800">
									نتایج
									جستجو (
									{
										searchResults.length
									}{" "}
									محصول)
								</h3>
								<button
									onClick={() =>
										setSearchResults(
											[]
										)
									}
									className="text-gray-500 hover:text-gray-700"
								>
									<FaTimes />
								</button>
							</div>

							<div className="grid gap-4">
								{searchResults.map(
									(
										product
									) => (
										<div
											key={
												product.id
											}
											className="bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:border-gray-300"
											onClick={() =>
												handleSelectExistingProduct(
													product
												)
											}
										>
											<div className="flex gap-4">
												<div className="w-20 h-20 flex-shrink-0">
													{product.images &&
													product
														.images
														.length >
														0 ? (
														<img
															src={
																product
																	.images[0]
															}
															alt={
																product.name
															}
															className="w-full h-full object-cover rounded-lg"
														/>
													) : (
														<div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
															<span className="text-gray-400 text-xs">
																بدون
																تصویر
															</span>
														</div>
													)}
												</div>
												<div className="flex-1 min-w-0">
													<h4 className="font-semibold text-gray-800 truncate">
														{
															product.name
														}
													</h4>
													<p className="text-sm text-gray-600 mt-1 line-clamp-2">
														{
															product.description
														}
													</p>
													<div className="flex items-center gap-4 mt-2 text-sm">
														<span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
															{
																product.category_name
															}
														</span>
														<span className="text-blue-600 flex items-center gap-1">
															<MdShoppingCart
																size={
																	16
																}
															/>
															{
																product.sellers_count
															}{" "}
															فروشنده
														</span>
													</div>
												</div>
												<div className="text-left">
													<div className="text-sm text-gray-500">
														قیمت
														از:
													</div>
													<div className="font-semibold text-green-600">
														{product.min_price
															? formatPrice(
																	product.min_price
															  )
															: "نامشخص"}{" "}
														تومان
													</div>
													{product.min_price !==
														product.max_price &&
														product.max_price && (
															<div className="text-xs text-gray-500">
																تا{" "}
																{formatPrice(
																	product.max_price
																)}{" "}
																تومان
															</div>
														)}
												</div>
											</div>
										</div>
									)
								)}
							</div>
						</div>
					)}

					{/* No Results */}
					{searchResults.length === 0 &&
						searchQuery &&
						!searchLoading && (
							<div className="text-center py-8">
								<div className="text-gray-400 mb-4">
									<MdShoppingCart
										size={
											48
										}
										className="mx-auto"
									/>
								</div>
								<h3 className="text-lg font-semibold text-gray-600 mb-2">
									محصولی
									یافت نشد
								</h3>
								<p className="text-gray-500 mb-4">
									محصول
									مورد نظر
									شما در
									سیستم
									وجود
									ندارد
								</p>
							</div>
						)}

					{/* Action Buttons */}
					<div className="flex gap-4 pt-6 border-t">
						<button
							onClick={
								handleCreateNewProduct
							}
							className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
						>
							<FaPlus />
							ایجاد محصول جدید
						</button>
					</div>

					{/* Helper Text */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h4 className="font-semibold text-blue-800 mb-2">
							راهنما:
						</h4>
						<ul className="text-sm text-blue-700 space-y-1">
							<li>
								• اگر محصول مورد
								نظر شما موجود
								است، آن را
								انتخاب کنید
							</li>
							<li>
								• شما می‌توانید
								قیمت و موجودی
								خود را برای آن
								محصول تعین کنید
							</li>
							<li>
								• اگر محصول
								جدیدی است،
								"ایجاد محصول
								جدید" را کلیک
								کنید
							</li>
						</ul>
					</div>
				</div>
			)}

			{/* === EXISTING PRODUCT OFFER WORKFLOW === */}
			{currentWorkflow === "existing-offer" &&
				selectedExistingProduct && (
					<div className="space-y-6">
						<div className="flex items-center gap-4">
							<button
								onClick={
									handleBackToSearch
								}
								className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<FaArrowLeft />
							</button>
							<div>
								<h2 className="text-2xl font-bold text-gray-800">
									افزودن
									پیشنهاد
									فروش
								</h2>
								<p className="text-gray-600">
									قیمت و
									شرایط
									فروش خود
									را برای
									این
									محصول
									تعین
									کنید
								</p>
							</div>
						</div>

						{/* Selected Product Info */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<div className="flex gap-4">
								{selectedExistingProduct.images &&
								selectedExistingProduct
									.images
									.length >
									0 ? (
									<img
										src={
											selectedExistingProduct
												.images[0]
										}
										alt={
											selectedExistingProduct.name
										}
										className="w-16 h-16 object-cover rounded-lg"
									/>
								) : (
									<div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
										<span className="text-gray-400 text-xs">
											بدون
											تصویر
										</span>
									</div>
								)}
								<div>
									<h3 className="font-semibold text-gray-800">
										{
											selectedExistingProduct.name
										}
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										{
											selectedExistingProduct.description
										}
									</p>
									<div className="flex items-center gap-2 mt-2 text-sm">
										<span className="bg-white px-2 py-1 rounded text-gray-700">
											{
												selectedExistingProduct.category_name
											}
										</span>
										<span className="text-blue-600">
											{
												selectedExistingProduct.sellers_count
											}{" "}
											فروشنده
											دیگر
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Pricing Section */}
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								قیمت گذاری
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										مدت
										گارانتی
										(ماه)
									</label>
									<input
										type="number"
										value={
											offerData.warranty
										}
										onChange={(
											e
										) =>
											handleOfferInputChange(
												"warranty",
												e
													.target
													.value
											)
										}
										className={
											inputClasses
										}
										placeholder="مدت گارانتی"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										زمان
										ارسال
									</label>
									<select
										value={
											offerData.shippingTime
										}
										onChange={(
											e
										) =>
											handleOfferInputChange(
												"shippingTime",
												e
													.target
													.value
											)
										}
										className={
											inputClasses
										}
									>
										<option value="1-3">
											1
											تا
											3
											روز
											کاری
										</option>
										<option value="3-7">
											3
											تا
											7
											روز
											کاری
										</option>
										<option value="7-14">
											7
											تا
											14
											روز
											کاری
										</option>
										<option value="14+">
											بیش
											از
											14
											روز
										</option>
									</select>
								</div>
							</div>

							<div className="mt-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									توضیحات
									اضافی
								</label>
								<textarea
									rows={4}
									value={
										offerData.description
									}
									onChange={(
										e
									) =>
										handleOfferInputChange(
											"description",
											e
												.target
												.value
										)
									}
									className={
										textareaClasses
									}
									placeholder="توضیحات اضافی درباره محصول، شرایط فروش، یا ویژگی های خاص..."
								/>
							</div>
						</div>

						{/* Warning */}
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<div className="flex gap-3">
								<MdWarning
									className="text-yellow-600 mt-0.5"
									size={
										20
									}
								/>
								<div>
									<h4 className="font-semibold text-yellow-800">
										توجه:
									</h4>
									<ul className="text-sm text-yellow-700 mt-1 space-y-1">
										<li>
											•
											قیمت
											و
											شرایط
											شما
											در
											کنار
											سایر
											فروشندگان
											نمایش
											داده
											خواهد
											شد
										</li>
										<li>
											•
											مشتریان
											بر
											اساس
											قیمت،
											زمان
											ارسال
											و
											امتیاز
											فروشنده
											انتخاب
											می‌کنند
										</li>
										<li>
											•
											اطمینان
											حاصل
											کنید
											که
											محصول
											شما
											کیفیت
											مناسب
											دارد
										</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-4 pt-6 border-t">
							<button
								onClick={
									handleBackToSearch
								}
								className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								بازگشت
							</button>
							<button
								onClick={
									handleOfferSubmit
								}
								disabled={
									loading
								}
								className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
							>
								<FaCheckCircle />
								{loading
									? "در حال ثبت..."
									: "ثبت پیشنهاد فروش"}
							</button>
						</div>
					</div>
				)}

			{/* === NEW PRODUCT WORKFLOW === */}
			{currentWorkflow === "new-product" && (
				<div>
					{/* Header */}
					<div className="mb-6 flex items-center gap-4">
						<button
							onClick={
								handleBackToSearch
							}
							className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<FaArrowLeft />
						</button>
						<div>
							<h1 className="text-2xl font-bold text-gray-800 mb-2">
								ایجاد محصول جدید
							</h1>
							<p className="text-gray-600">
								اطلاعات محصول
								جدید خود را کامل
								کنید
							</p>
						</div>
					</div>

					{/* Step Indicator */}
					<div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-lg">
						<StepIndicator
							step={1}
							title="اطلاعات پایه"
							isActive={
								currentStep ===
								1
							}
							isCompleted={
								currentStep > 1
							}
						/>
						<div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
						<StepIndicator
							step={2}
							title="قیمت گذاری و موجودی"
							isActive={
								currentStep ===
								2
							}
							isCompleted={
								currentStep > 2
							}
						/>
						<div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
						<StepIndicator
							step={3}
							title="تصاویر محصول"
							isActive={
								currentStep ===
								3
							}
							isCompleted={
								currentStep > 3
							}
						/>
						<div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
						<StepIndicator
							step={4}
							title="مشخصات و تنوع"
							isActive={
								currentStep ===
								4
							}
							isCompleted={false}
						/>
					</div>

					{/* Step Content */}
					<div className="min-h-96">
						{/* Step 1: Basic Information */}
						{currentStep === 1 && (
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											نام
											محصول
											*
										</label>
										<input
											type="text"
											value={
												productName
											}
											onChange={(
												e
											) =>
												setProductName(
													e
														.target
														.value
												)
											}
											className={
												inputClasses
											}
											placeholder="نام محصول را وارد کنید"
										/>
										{errors.productName && (
											<p className="text-red-500 text-xs mt-1">
												{
													errors.productName
												}
											</p>
										)}
									</div>
									{/* Updated
									category
									dropdown
									in Step
									1 */}
									<div>
	<label className="block text-sm font-medium text-gray-700 mb-2">
		دسته بندی *
	</label>
	<select
		value={category}
		onChange={(e) => handleCategoryChange(e.target.value)}
		className={inputClasses}
		disabled={categoriesLoading}
	>
		<option value="">
			{categoriesLoading ? "در حال بارگذاری..." : "انتخاب دسته بندی"}
		</option>
		{categories.map(cat => (
			<option key={cat.id} value={cat.name}>{cat.name}</option>
		))}
	</select>
	{errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
	{categoriesError && <p className="text-red-500 text-xs mt-1">{categoriesError}</p>}
</div>
{/* // Add error display component (place this after the category dropdown) */}
{categoriesError && (
	<div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
		<div className="flex items-center gap-2">
			<span className="text-red-600">⚠️</span>
			<span className="text-red-700 text-sm">{categoriesError}</span>
			<button
				onClick={reloadCategories}
				className="ml-auto text-red-600 hover:text-red-800 underline text-sm"
			>
				تلاش مجدد
			</button>
		</div>
	</div>
)}

									{/* //
									Updated
									subcategory
									dropdown
									in Step
									1 */}
									<div>
	<label className="block text-sm font-medium text-gray-700 mb-2">
		زیر دسته
	</label>
	<select
		value={subcategory}
		onChange={(e) => setSubcategory(e.target.value)}
		className={inputClasses}
		disabled={!category || subcategories.length === 0}
	>
		<option value="">
			{subcategories.length === 0 ? "زیر دسته‌ای موجود نیست" : "انتخاب زیر دسته"}
		</option>
		{subcategories.map(subcat => (
			<option key={subcat.id} value={subcat.name}>{subcat.name}</option>
		))}
	</select>
</div>


									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											برند
										</label>
										<input
											type="text"
											value={
												brand
											}
											onChange={(
												e
											) =>
												setBrand(
													e
														.target
														.value
												)
											}
											className={
												inputClasses
											}
											placeholder="نام برند"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											مدل
										</label>
										<input
											type="text"
											value={
												model
											}
											onChange={(
												e
											) =>
												setModel(
													e
														.target
														.value
												)
											}
											className={
												inputClasses
											}
											placeholder="مدل محصول"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											کد
											محصول
											(SKU)
										</label>
										<input
											type="text"
											value={
												sku
											}
											onChange={(
												e
											) =>
												setSku(
													e
														.target
														.value
												)
											}
											className={
												inputClasses
											}
											placeholder="کد یکتای محصول"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										توضیحات
										محصول
										*
									</label>
									<textarea
										rows={
											4
										}
										value={
											productDescription
										}
										onChange={(
											e
										) =>
											setProductDescription(
												e
													.target
													.value
											)
										}
										className={
											textareaClasses
										}
										placeholder="توضیحات کامل محصول را وارد کنید..."
									/>
									{errors.productDescription && (
										<p className="text-red-500 text-xs mt-1">
											{
												errors.productDescription
											}
										</p>
									)}
								</div>
							</div>
						)}

						{/* Step 2: Pricing and Inventory */}
						{currentStep === 2 && (
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											قیمت
											پایه
											(تومان)
											*
										</label>
										<input
											type="number"
											value={
												basePrice
											}
											onChange={(
												e
											) => {
												setBasePrice(
													e
														.target
														.value
												);
												calculateDiscountPercent();
											}}
											className={
												inputClasses
											}
											placeholder="قیمت پایه محصول"
										/>
										{errors.basePrice && (
											<p className="text-red-500 text-xs mt-1">
												{
													errors.basePrice
												}
											</p>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											قیمت
											با
											تخفیف
											(تومان)
										</label>
										<input
											type="number"
											value={
												discountPrice
											}
											onChange={(
												e
											) => {
												setDiscountPrice(
													e
														.target
														.value
												);
												calculateDiscountPercent();
											}}
											className={
												inputClasses
											}
											placeholder="قیمت با تخفیف"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											درصد
											تخفیف
										</label>
										<input
											type="number"
											value={
												discountPercent
											}
											onChange={(
												e
											) =>
												setDiscountPercent(
													e
														.target
														.value
												)
											}
											className={
												inputClasses
											}
											placeholder="درصد تخفیف"
											readOnly
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											موجودی
											انبار
											*
										</label>
										<input
											type="number"
											value={
												stock
											}
											onChange={(
												e
											) =>
												setStock(
													e
														.target
														.value
												)
											}
											className={
												inputClasses
											}
											placeholder="تعداد موجودی"
										/>
										{errors.stock && (
											<p className="text-red-500 text-xs mt-1">
												{
													errors.stock
												}
											</p>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											وزن
											(گرم)
										</label>
										<input
											type="number"
											value={
												weight
											}
											onChange={(
												e
											) =>
												setWeight(
													e
														.target
														.value
												)
											}
											className={
												inputClasses
											}
											placeholder="وزن محصول"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										ابعاد
										محصول
										(سانتی
										متر)
									</label>
									<div className="grid grid-cols-3 gap-4">
										<input
											type="number"
											value={
												dimensions.length
											}
											onChange={(
												e
											) =>
												setDimensions(
													(
														prev
													) => ({
														...prev,
														length: e
															.target
															.value,
													})
												)
											}
											className={
												inputClasses
											}
											placeholder="طول"
										/>
										<input
											type="number"
											value={
												dimensions.width
											}
											onChange={(
												e
											) =>
												setDimensions(
													(
														prev
													) => ({
														...prev,
														width: e
															.target
															.value,
													})
												)
											}
											className={
												inputClasses
											}
											placeholder="عرض"
										/>
										<input
											type="number"
											value={
												dimensions.height
											}
											onChange={(
												e
											) =>
												setDimensions(
													(
														prev
													) => ({
														...prev,
														height: e
															.target
															.value,
													})
												)
											}
											className={
												inputClasses
											}
											placeholder="ارتفاع"
										/>
									</div>
								</div>
							</div>
						)}

						{/* Step 3: Product Images */}
						{currentStep === 3 && (
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-4">
										تصاویر
										محصول
										*
									</label>

									<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
										<input
											type="file"
											multiple
											accept="image/*"
											onChange={
												handleImageUpload
											}
											className="hidden"
											id="image-upload"
										/>
										<label
											htmlFor="image-upload"
											className="cursor-pointer"
										>
											<div className="text-gray-400 mb-2">
												<FaPlus
													size={
														48
													}
													className="mx-auto"
												/>
											</div>
											<p className="text-gray-600">
												کلیک
												کنید
												یا
												تصاویر
												را
												اینجا
												بکشید
											</p>
											<p className="text-gray-400 text-sm mt-1">
												فرمت
												های
												مجاز:
												JPG,
												PNG,
												GIF
											</p>
										</label>
									</div>
									{errors.images && (
										<p className="text-red-500 text-xs mt-1">
											{
												errors.images
											}
										</p>
									)}

									{/* Image Gallery */}
									{productImages.length >
										0 && (
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
											{productImages.map(
												(
													image
												) => (
													<div
														key={
															image.id
														}
														className="relative group"
													>
														<img
															src={
																image.url
															}
															alt={
																image.name
															}
															className={`w-full h-32 object-cover rounded-lg border-2 cursor-pointer transition-colors ${
																image.isMain
																	? "border-blue-500"
																	: "border-gray-200 hover:border-blue-400"
															}`}
															onClick={() =>
																setModalImage(
																	image
																)
															}
														/>

														{/* Main image indicator */}
														{image.isMain && (
															<div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
																اصلی
															</div>
														)}

														{/* Action buttons */}
														<div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
															{!image.isMain && (
																<button
																	onClick={() =>
																		setMainImage(
																			image.id
																		)
																	}
																	className="bg-green-500 text-white rounded p-1 text-xs"
																	title="انتخاب به عنوان تصویر اصلی"
																>
																	<MdEdit
																		size={
																			12
																		}
																	/>
																</button>
															)}
															<button
																onClick={() =>
																	removeImage(
																		image.id
																	)
																}
																className="bg-red-500 text-white rounded p-1 text-xs"
																title="حذف تصویر"
															>
																<MdDelete
																	size={
																		12
																	}
																/>
															</button>
														</div>

														<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
															{
																image.name
															}
														</div>
													</div>
												)
											)}
										</div>
									)}
								</div>
							</div>
						)}

						{/* Step 4: Specifications and Variants */}
						{currentStep === 4 && (
							<div className="space-y-8">
								{/* Product Attributes */}
								<div>
									<h3 className="text-lg font-semibold text-gray-800 mb-4">
										مشخصات
										محصول
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
										<input
											type="text"
											value={
												newAttribute.name
											}
											onChange={(
												e
											) =>
												setNewAttribute(
													(
														prev
													) => ({
														...prev,
														name: e
															.target
															.value,
													})
												)
											}
											className={
												inputClasses
											}
											placeholder="نام مشخصه (مثل: رنگ)"
										/>
										<input
											type="text"
											value={
												newAttribute.value
											}
											onChange={(
												e
											) =>
												setNewAttribute(
													(
														prev
													) => ({
														...prev,
														value: e
															.target
															.value,
													})
												)
											}
											className={
												inputClasses
											}
											placeholder="مقدار (مثل: قرمز)"
										/>
										<button
											onClick={
												addAttribute
											}
											className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
										>
											<IoMdAdd />{" "}
											افزودن
											مشخصه
										</button>
									</div>

									{/* Attributes List */}
									{attributes.length >
										0 && (
										<div className="bg-gray-50 rounded-lg p-4">
											<h4 className="font-medium text-gray-700 mb-3">
												مشخصات
												افزوده
												شده:
											</h4>
											<div className="space-y-2">
												{attributes.map(
													(
														attr
													) => (
														<div
															key={
																attr.id
															}
															className="flex items-center justify-between bg-white p-2 rounded border"
														>
															<span className="text-gray-700">
																<strong>
																	{
																		attr.name
																	}
																	:
																</strong>{" "}
																{
																	attr.value
																}
															</span>
															<button
																onClick={() =>
																	removeAttribute(
																		attr.id
																	)
																}
																className="text-red-500 hover:text-red-700"
															>
																<FaTimes />
															</button>
														</div>
													)
												)}
											</div>
										</div>
									)}
								</div>

								{/* Product Variants */}
								<div>
									<h3 className="text-lg font-semibold text-gray-800 mb-4">
										تنوع
										محصول
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
										<input
											type="text"
											value={
												newVariant.type
											}
											onChange={(
												e
											) =>
												setNewVariant(
													(
														prev
													) => ({
														...prev,
														type: e
															.target
															.value,
													})
												)
											}
											className={
												inputClasses
											}
											placeholder="نوع (مثل: رنگ، سایز)"
										/>
										<input
											type="text"
											value={
												newVariant.value
											}
											onChange={(
												e
											) =>
												setNewVariant(
													(
														prev
													) => ({
														...prev,
														value: e
															.target
															.value,
													})
												)
											}
											className={
												inputClasses
											}
											placeholder="مقدار (مثل: قرمز، XL)"
										/>
										<input
											type="number"
											value={
												newVariant.price
											}
											onChange={(
												e
											) =>
												setNewVariant(
													(
														prev
													) => ({
														...prev,
														price: e
															.target
															.value,
													})
												)
											}
											className={
												inputClasses
											}
											placeholder="قیمت اضافی"
										/>
										<input
											type="number"
											value={
												newVariant.stock
											}
											onChange={(
												e
											) =>
												setNewVariant(
													(
														prev
													) => ({
														...prev,
														stock: e
															.target
															.value,
													})
												)
											}
											className={
												inputClasses
											}
											placeholder="موجودی"
										/>
										<button
											onClick={
												addVariant
											}
											className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
										>
											<IoMdAdd />{" "}
											افزودن
											تنوع
										</button>
									</div>

									{/* Variants List */}
									{variants.length >
										0 && (
										<div className="bg-gray-50 rounded-lg p-4">
											<h4 className="font-medium text-gray-700 mb-3">
												تنوع
												های
												افزوده
												شده:
											</h4>
											<div className="space-y-2">
												{variants.map(
													(
														variant
													) => (
														<div
															key={
																variant.id
															}
															className="flex items-center justify-between bg-white p-3 rounded border"
														>
															<div className="flex gap-4 text-sm">
																<span>
																	<strong>
																		نوع:
																	</strong>{" "}
																	{
																		variant.type
																	}
																</span>
																<span>
																	<strong>
																		مقدار:
																	</strong>{" "}
																	{
																		variant.value
																	}
																</span>
																{variant.price && (
																	<span>
																		<strong>
																			قیمت
																			اضافی:
																		</strong>{" "}
																		{
																			variant.price
																		}{" "}
																		تومان
																	</span>
																)}
																{variant.stock && (
																	<span>
																		<strong>
																			موجودی:
																		</strong>{" "}
																		{
																			variant.stock
																		}
																	</span>
																)}
															</div>
															<button
																onClick={() =>
																	removeVariant(
																		variant.id
																	)
																}
																className="text-red-500 hover:text-red-700"
															>
																<FaTimes />
															</button>
														</div>
													)
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Navigation Buttons */}
					<div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
						<button
							onClick={prevStep}
							disabled={
								currentStep ===
								1
							}
							className={`px-6 py-2 rounded-lg border transition-colors ${
								currentStep ===
								1
									? "border-gray-300 text-gray-400 cursor-not-allowed"
									: "border-gray-300 text-gray-700 hover:bg-gray-50"
							}`}
						>
							مرحله قبل
						</button>

						<div className="text-sm text-gray-500">
							مرحله {currentStep} از 4
						</div>

						{currentStep < 4 ? (
							<button
								onClick={
									nextStep
								}
								disabled={
									loading
								}
								className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
							>
								{loading
									? "در حال پردازش..."
									: "مرحله بعد"}
							</button>
						) : (
							<button
								onClick={
									handleSubmit
								}
								disabled={
									loading
								}
								className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
							>
								{loading
									? "در حال ایجاد..."
									: "ایجاد محصول"}
							</button>
						)}
					</div>

					{/* Image Modal */}
					{modalImage && (
						<div
							className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
							onClick={() =>
								setModalImage(
									null
								)
							}
						>
							<div className="relative max-w-4xl max-h-full p-4">
								<img
									src={
										modalImage.url
									}
									alt={
										modalImage.name
									}
									className="max-w-full max-h-full object-contain rounded-lg"
								/>
								<button
									onClick={() =>
										setModalImage(
											null
										)
									}
									className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-600 transition-colors"
								>
									×
								</button>
								<div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded text-center">
									{
										modalImage.name
									}
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CreateProduct;
