import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../auth/AuthContext";
import { MdOutlineSecurity, MdEdit, MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

const SellerProductDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { authTokens } = useContext(AuthContext);
	
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedImage, setSelectedImage] = useState(null);
	const [showOverlay, setShowOverlay] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editData, setEditData] = useState({
		price: "",
		stock: "",
		description: ""
	});

	useEffect(() => {
		fetchProductDetail();
	}, [id]);

	useEffect(() => {
		if (showOverlay) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
		return () => {
			document.body.style.overflow = 'auto';
		}
	}, [showOverlay]);

	const fetchProductDetail = async () => {
		try {
			const response = await axios.get(
				`http://127.0.0.1:8000/api/products/seller/${id}/`,
				{
					headers: {
						Authorization: `Bearer ${authTokens?.access}`,
					},
				}
			);
			setProduct(response.data);
			setSelectedImage(response.data.images?.[0]?.url || null);
			setEditData({
				price: response.data.price,
				stock: response.data.stock,
				description: response.data.description
			});
		} catch (error) {
			console.error("Error fetching product:", error);
			if (error.response?.status === 404) {
				alert("محصول یافت نشد");
				navigate("/seller-profile/products");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleImageClick = (imageUrl) => {
		setSelectedImage(imageUrl);
		setShowOverlay(true);
	};

	const handleEdit = async () => {
		if (!editMode) {
			setEditMode(true);
			return;
		}

		try {
			const response = await axios.put(
				`http://127.0.0.1:8000/api/products/seller/${id}/`,
				editData,
				{
					headers: {
						Authorization: `Bearer ${authTokens?.access}`,
					},
				}
			);
			setProduct(response.data);
			setEditMode(false);
			alert("محصول با موفقیت بروزرسانی شد");
		} catch (error) {
			console.error("Error updating product:", error);
			alert("خطا در بروزرسانی محصول");
		}
	};

	const handleDelete = async () => {
		if (!window.confirm("آیا از حذف این محصول اطمینان دارید؟")) {
			return;
		}

		try {
			await axios.delete(
				`http://127.0.0.1:8000/api/products/seller/${id}/`,
				{
					headers: {
						Authorization: `Bearer ${authTokens?.access}`,
					},
				}
			);
			alert("محصول با موفقیت حذف شد");
			navigate("/seller-profile/products");
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("خطا در حذف محصول");
		}
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat('fa-IR').format(price);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="text-center py-20">
				<p>محصولی یافت نشد</p>
				<Link to="/seller-profile/products" className="text-blue-500 hover:underline">
					بازگشت به لیست محصولات
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/seller-profile/products")}
								className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<FaArrowLeft />
							</button>
							<h1 className="text-xl font-bold text-gray-800">جزئیات محصول</h1>
						</div>
						<div className="flex gap-2">
							<button
								onClick={handleEdit}
								className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
									editMode 
										? "bg-green-500 text-white hover:bg-green-600"
										: "bg-blue-500 text-white hover:bg-blue-600"
								}`}
							>
								<MdEdit />
								{editMode ? "ذخیره تغییرات" : "ویرایش"}
							</button>
							{editMode && (
								<button
									onClick={() => setEditMode(false)}
									className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
								>
									انصراف
								</button>
							)}
							<button
								onClick={handleDelete}
								className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
							>
								<MdDelete />
								حذف محصول
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Breadcrumb */}
			<div className="max-w-7xl mx-auto px-4 py-3">
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<Link to="/seller-profile" className="hover:text-blue-600">داشبورد</Link>
					<span>/</span>
					<Link to="/seller-profile/products" className="hover:text-blue-600">محصولات</Link>
					<span>/</span>
					<span className="text-gray-900">{product.name}</span>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-6">
				<div className="bg-white rounded-lg shadow-lg p-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Image Gallery */}
						<div>
							{/* Main Image */}
							<div className="mb-4 bg-gray-50 rounded-lg p-4">
								{selectedImage ? (
									<img
										src={selectedImage}
										alt={product.name}
										className="w-full h-96 object-contain cursor-pointer"
										onClick={() => handleImageClick(selectedImage)}
									/>
								) : (
									<div className="w-full h-96 flex items-center justify-center text-gray-400">
										<span>بدون تصویر</span>
									</div>
								)}
							</div>

							{/* Thumbnail Gallery */}
							{product.images && product.images.length > 0 && (
								<div className="grid grid-cols-4 gap-2">
									{product.images.map((img, index) => (
										<div
											key={img.id || index}
											className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${
												selectedImage === img.url 
													? "border-blue-500" 
													: "border-gray-200 hover:border-gray-400"
											}`}
											onClick={() => setSelectedImage(img.url)}
										>
											<img
												src={img.url}
												alt={img.alt_text || product.name}
												className="w-full h-20 object-contain"
											/>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Product Info */}
						<div>
							{/* Category */}
							<div className="text-blue-600 text-sm mb-2">
								{product.category_name}
							</div>

							{/* Product Name */}
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								{product.name}
							</h2>

							{/* Description */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									توضیحات
								</label>
								{editMode ? (
									<textarea
										value={editData.description}
										onChange={(e) => setEditData({...editData, description: e.target.value})}
										className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										rows={4}
									/>
								) : (
									<p className="text-gray-600">
										{product.description || "توضیحاتی وجود ندارد"}
									</p>
								)}
							</div>

							{/* Price and Stock */}
							<div className="bg-gray-50 rounded-lg p-6 mb-6">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											قیمت (تومان)
										</label>
										{editMode ? (
											<input
												type="number"
												value={editData.price}
												onChange={(e) => setEditData({...editData, price: e.target.value})}
												className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
											/>
										) : (
											<p className="text-2xl font-bold text-green-600">
												{formatPrice(product.price)}
											</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											موجودی
										</label>
										{editMode ? (
											<input
												type="number"
												value={editData.stock}
												onChange={(e) => setEditData({...editData, stock: e.target.value})}
												className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
											/>
										) : (
											<p className={`text-2xl font-bold ${
												product.stock > 0 ? "text-blue-600" : "text-red-600"
											}`}>
												{product.stock > 0 ? `${product.stock} عدد` : "ناموجود"}
											</p>
										)}
									</div>
								</div>
							</div>

							{/* Variants */}
							{product.variants && product.variants.length > 0 && (
								<div className="mb-6">
									<h3 className="text-lg font-semibold mb-3">تنوع محصول</h3>
									<div className="space-y-2">
										{product.variants.map((variant) => (
											<div key={variant.id} className="bg-gray-50 p-3 rounded-lg">
												{Object.entries(variant.attributes).map(([key, value]) => (
													<span key={key} className="text-sm mr-4">
														<strong>{key}:</strong> {value}
													</span>
												))}
											</div>
										))}
									</div>
								</div>
							)}

							{/* Features */}
							<div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
								<div className="flex items-center gap-2">
									<MdOutlineSecurity className="text-gray-500" />
									<span className="text-sm text-gray-600">گارانتی 18 ماهه</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">امکان تحویل اکسپرس</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">7 روز ضمانت بازگشت</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">ضمانت اصل بودن کالا</span>
								</div>
							</div>

							{/* Timestamps */}
							<div className="mt-6 pt-6 border-t text-sm text-gray-500">
								<p>تاریخ ایجاد: {new Date(product.created_at).toLocaleDateString('fa-IR')}</p>
								<p>آخرین بروزرسانی: {new Date(product.updated_at).toLocaleDateString('fa-IR')}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Image Overlay */}
			{showOverlay && (
				<div className="fixed inset-0 w-full h-full bg-black bg-opacity-90 z-50">
					<button 
						className="text-white absolute top-4 right-4 hover:cursor-pointer"
						onClick={() => setShowOverlay(false)}
					>
						<IoClose className="text-white w-12 h-12"/>
					</button>
					<div className="w-full h-full flex justify-center items-center">
						<img 
							src={selectedImage} 
							alt={product.name} 
							className="max-w-full max-h-full object-contain"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default SellerProductDetail;