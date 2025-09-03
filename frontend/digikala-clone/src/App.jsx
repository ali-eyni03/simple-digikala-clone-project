import "./tailwind.css";
import "./global.css";
import MainPage from "./pages/MainPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProductPage } from "./pages/ProductPage.jsx";
import LoginPage from "./pages/users/LoginRegisterPage.jsx";
import ProfileLayout from "./pages/users/ProfileLayout.jsx";
import OrdersPage from "./pages/orders/OrdersPage.jsx";
import ProfileAddresses from "./pages/adresses/ProfileAddresses.jsx";
import UserPersonalInfo from "./pages/personalInfo/PersonalInfo.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfileLists from "./pages/usersLikedList/UserLikedList.jsx";
import UserComments from "./pages/comments/UserComments.jsx";
import UserNotifications from "./pages/notifications/UserNotifications.jsx";
import SellerHomePage from "./pages/sellersPage/SellerHomePage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import SellerLoginRegisterPage from "./pages/sellersPage/sellerLoginRegisterPage/SellerLoginRegisterPage.jsx";
import EnhancedSellerRegister from "./pages/sellersPage/components/EnhancedSellerRegister.jsx";
import SellerRouteGuard from "./pages/sellersPage/SellerRouteGuard.jsx";
import SellerProfileLayout from "./pages/sellersPage/SellerProfileLayout.jsx";
import ProfileHomePage from "./pages/sellersPage/pages/SellerDashboard.jsx";
import SellerProducts from "./pages/sellersPage/pages/SellerProducts.jsx";
import SellerStoreInfo from "./pages/sellersPage/pages/SellerStoreInfo.jsx";
import SellerAddress from "./pages/sellersPage/pages/SellerAddress.jsx";
import SellerProfileInfo from "./pages/sellersPage/pages/SellerProfileInfo.jsx";
import UserProfileHomePage from "./pages/profileHomePage/ProfileHomePage.jsx";
import SellerProductDetail from "./pages/sellersPage/pages/SellerProductDetail.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import CreateProduct from "./pages/sellersPage/pages/CreateProduct.jsx";
import ManageProducts from "./pages/sellersPage/pages/ManageProducts.jsx";
function App() {
	return (
		<>
			<AuthProvider>
				<CartProvider>
					<Router>
						<ScrollToTop/>
						<Routes>
							{/* Public Routes */}
							<Route path="/" element={<MainPage />} />
							<Route path="/product/:id" element={<ProductPage />} />
							<Route path="/users/login/" element={<LoginPage />} />
							
							{/* ADD CART ROUTE */}
							<Route path="/cart" element={<CartPage />} />
							<Route path="/checkout" element={<CheckoutPage />} />
							<Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
							<Route path="/checkout" element={<CheckoutPage />} />
							{/* Seller Public Routes */}
							<Route path="/seller" element={<SellerHomePage />} />
							
							{/* Enhanced Seller Registration */}
							<Route path="/seller-register" element={<EnhancedSellerRegister />} />
							
							{/* BACKUP: Keep old auth page as alternative */}
							<Route path="/seller-auth" element={<SellerLoginRegisterPage />} />
							
							{/* User Protected Routes */}
							<Route path="/profile" element={<ProtectedRoute />}>
								<Route element={<ProfileLayout />}>
									<Route index element={<UserProfileHomePage />} />
									<Route path="orders" element={<OrdersPage />} />
									<Route path="addresses" element={<ProfileAddresses />} />
									<Route path="personal-info" element={<UserPersonalInfo />} />
									<Route path="lists" element={<ProfileLists />} />
									<Route path="comments" element={<UserComments />} />
									<Route path="notifications" element={<UserNotifications />} />
								</Route>
							</Route>
							
							{/* ENHANCED: Seller Protected Routes with NEW SellerRouteGuard */}
							<Route path="/seller-profile" element={
								<SellerRouteGuard>
									<SellerProfileLayout />
								</SellerRouteGuard>
							}>	
								<Route index element={<ProfileHomePage />} />
								<Route path="info" element={<SellerProfileInfo />} />
								<Route path="store-info" element={<SellerStoreInfo />} />
								<Route path="address" element={<SellerAddress />} />
								<Route path="products" element={<SellerProducts />} />
								<Route path="products/create" element={<CreateProduct />} />
    							<Route path="products/manage" element={<ManageProducts />} />
								{/* Product Detail Page */}
								<Route path="product/:id" element={<SellerProductDetail />} />
								
								{/* Future routes - uncomment when ready */}
								{/* <Route path="wallet" element={<SellerWallet />} />
    							<Route path="messages" element={<SellerMessages />} /> */}
							</Route>
						</Routes>
					</Router>
				</CartProvider>
			</AuthProvider>
		</>
	);
}

export default App;