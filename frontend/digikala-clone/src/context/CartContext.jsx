import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                ...state,
                items: action.payload.items || [],
                totalItems: action.payload.total_items || 0,
                totalPrice: action.payload.total_price || 0,
                loading: false
            };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'CLEAR_CART':
            return {
                ...state,
                items: [],
                totalItems: 0,
                totalPrice: 0
            };
        default:
            return state;
    }
};

const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    error: null
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { authTokens, user } = useContext(AuthContext);

    const API_BASE = 'http://127.0.0.1:8000/api';

    const getAxiosInstance = () => {
        return axios.create({
            baseURL: API_BASE,
            headers: authTokens ? {
                'Authorization': `Bearer ${authTokens.access}`
            } : {}
        });
    };

    const fetchCart = async () => {
        if (!user || !authTokens) {
            dispatch({ type: 'CLEAR_CART' });
            return;
        }
        
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const axiosInstance = getAxiosInstance();
            const response = await axiosInstance.get('/orders/cart/');
            dispatch({ type: 'SET_CART', payload: response.data });
        } catch (error) {
            console.error('Error fetching cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            dispatch({ type: 'CLEAR_CART' });
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!user || !authTokens) {
            alert('برای افزودن به سبد خرید باید وارد حساب کاربری خود شوید');
            return false;
        }

        try {
            const axiosInstance = getAxiosInstance();
            const response = await axiosInstance.post('/orders/cart/add/', {
                product_id: productId,
                quantity: quantity
            });
            
            await fetchCart();
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            const errorMsg = error.response?.data?.detail || 'خطا در افزودن به سبد خرید';
            alert(errorMsg);
            dispatch({ type: 'SET_ERROR', payload: errorMsg });
            return false;
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        if (!user || !authTokens) return false;

        try {
            const axiosInstance = getAxiosInstance();
            const response = await axiosInstance.patch(`/orders/cart/items/${itemId}/`, {
                quantity: quantity
            });
            
            await fetchCart();
            return true;
        } catch (error) {
            console.error('Error updating cart item:', error);
            const errorMsg = error.response?.data?.detail || 'خطا در بروزرسانی سبد خرید';
            alert(errorMsg);
            dispatch({ type: 'SET_ERROR', payload: errorMsg });
            return false;
        }
    };

    const removeFromCart = async (itemId) => {
        if (!user || !authTokens) return false;

        try {
            const axiosInstance = getAxiosInstance();
            await axiosInstance.delete(`/orders/cart/items/${itemId}/remove/`);
            
            // Refresh cart
            await fetchCart();
            return true;
        } catch (error) {
            console.error('Error removing from cart:', error);
            const errorMsg = error.response?.data?.detail || 'خطا در حذف از سبد خرید';
            alert(errorMsg);
            dispatch({ type: 'SET_ERROR', payload: errorMsg });
            return false;
        }
    };

    const clearCart = async () => {
        if (!user || !authTokens) return false;

        try {
            const axiosInstance = getAxiosInstance();
            await axiosInstance.delete('/orders/cart/clear/');
            dispatch({ type: 'CLEAR_CART' });
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            const errorMsg = error.response?.data?.detail || 'خطا در پاک کردن سبد خرید';
            alert(errorMsg);
            dispatch({ type: 'SET_ERROR', payload: errorMsg });
            return false;
        }
    };

    const createOrder = async (orderData) => {
        if (!user || !authTokens) {
            return { success: false, error: 'کاربر وارد نشده است' };
        }

        try {
            const axiosInstance = getAxiosInstance();
            const response = await axiosInstance.post('/orders/orders/create/', orderData);
            
            dispatch({ type: 'CLEAR_CART' });
            
            return { 
                success: true, 
                order: response.data 
            };
        } catch (error) {
            console.error('Error creating order:', error);
            const errorMsg = error.response?.data?.detail || 'خطا در ثبت سفارش';
            
            return { 
                success: false, 
                error: errorMsg 
            };
        }
    };

    useEffect(() => {
        if (user && authTokens) {
            fetchCart();
        } else {
            dispatch({ type: 'CLEAR_CART' });
        }
    }, [user, authTokens]);

    const value = {
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        createOrder,  
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;