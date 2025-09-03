import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const SellersProtectedRoute = () => {
	const { authTokens } = useContext(AuthContext);

	return authTokens ? <Outlet /> : <Navigate to="/seller-register/" />;
};

export default SellersProtectedRoute;
