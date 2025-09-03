import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [authTokens, setAuthTokens] = useState(() =>
		localStorage.getItem("authTokens")
			? JSON.parse(localStorage.getItem("authTokens"))
			: null
	);
	const [user, setUser] = useState(null);
	const [userRole, setUserRole] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		return !!localStorage.getItem("authTokens");
	});

	useEffect(() => {
		if (authTokens) {
			const decodedUser = parseJwt(authTokens.access);
			setUser(decodedUser);
			setIsAuthenticated(true);
			localStorage.setItem("authTokens", JSON.stringify(authTokens));
			checkUserRole(authTokens);
		} else {
			setUser(null);
			setUserRole(null);
			setIsAuthenticated(false);
			localStorage.removeItem("authTokens");
		}
	}, [authTokens]);

	const checkUserRole = async (tokens) => {
		try {
			const response = await axios.get(
				"http://127.0.0.1:8000/api/accounts/check-role/",
				{
					headers: {
						Authorization: `Bearer ${tokens.access}`,
					},
				}
			);
			
			if (response.data.is_seller) {
				setUserRole('seller');
			} else {
				setUserRole('user');
			}
		} catch (error) {
			console.error("Error checking user role:", error);
			setUserRole('user');
		}
	};

	const loginUser = async (username, password) => {
		try {
			const response = await axios.post(
				"http://127.0.0.1:8000/api/jwt/login/",
				{ 
					phone_number: username,
					password: password 
				}
			);

			const { access, refresh } = response.data;
			const tokens = { access, refresh };

			setAuthTokens(tokens);
			await checkUserRole(tokens);
			
			return { success: true };

		} catch (error) {
			console.error(
				"Login failed",
				error.response?.data || error.message
			);
			return { 
				success: false, 
				error: error.response?.data?.detail || "خطا در ورود" 
			};
		}
	};

	const logoutUser = () => {
		setAuthTokens(null);
		setUser(null);
		setUserRole(null);
		setIsAuthenticated(false);
		localStorage.removeItem("authTokens");
	};

	const refreshUserRole = async () => {
		if (authTokens) {
			await checkUserRole(authTokens);
		}
	};

	const contextData = {
		authTokens,
		setAuthTokens,
		user,
		userRole, 
		isAuthenticated,
		setIsAuthenticated,
		loginUser,
		logoutUser,
		refreshUserRole, 
	};

	return (
		<AuthContext.Provider value={contextData}>
			{children}
		</AuthContext.Provider>
	);
};

function parseJwt(token) {
	try {
		return JSON.parse(atob(token.split(".")[1]));
	} catch (e) {
		return null;
	}
}