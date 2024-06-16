import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import Search from './Search';

function UserDashboard() {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentView, setCurrentView] = useState('search');
    const [productQuantities, setProductQuantities] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userID');
        if (!userId) {
            navigate('/user-login');
            return;
        }

        const handleNavigation = () => {
            const currentPath = window.location.pathname;
            if (currentPath !== '/user-dashboard') {
                localStorage.removeItem('userID');
            }
        };

        window.addEventListener('popstate', handleNavigation);

        return () => {
            window.removeEventListener('popstate', handleNavigation);
            if (window.location.pathname !== '/user-dashboard') {
                localStorage.removeItem('userID');
            }
        };
    }, [navigate]);

    const fetchCart = async () => {
        try {
            const userId = localStorage.getItem('userID');
            const response = await axios.get(`/cart/${userId}`);
            setCart(response.data.cart);
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching the cart');
        }
    };

    const fetchOrders = async () => {
        try {
            const userId = localStorage.getItem('userID');
            const response = await axios.get(`/orders/${userId}`);
            setOrders(response.data.products);
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching the orders');
        }
    };

    const handleSearch = async (prompt) => {
        try {
            const response = await axios.post('http://localhost:3000/api/search', { prompt });
            setProducts(response.data);
        } catch (error) {
            console.error(error);
            alert('An error occurred while searching for products');
        }
    };

    const handleAddToCart = async (productId, quantity) => {
        if(quantity < 1) {
            alert('Quantity should be at least 1');
            return;
        }
        try {
            const userId = localStorage.getItem('userID');
            await axios.post(`/cart/${userId}/${productId}`, { quantity });
            fetchCart();
        } catch (error) {
            console.error(error);
            alert('An error occurred while adding to cart');
        }
    };

    const handleUpdateCart = async (productId, quantity) => {
        try {
            const userId = localStorage.getItem('userID');
            await axios.put(`/cart/${userId}/${productId}`, { quantity });
            fetchCart();
        } catch (error) {
            console.error(error);
            alert('An error occurred while updating the cart');
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const userId = localStorage.getItem('userID');
            await axios.delete(`/cancel_order/${orderId}`, { data: { userID: userId } });
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert('An error occurred while canceling the order');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userID');
        navigate('/user-login');
    };

    const handleQuantityChange = (productId, quantity) => {
        setProductQuantities((prevProductQuantities) => ({
            ...prevProductQuantities,
            [productId]: quantity,
        }));
    }

    return (
        <div className="user-dashboard-container">
            <div className="user-dashboard-card">
                <div className="left-buttons">
                    <button className="logout-button" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                    <button className="cart-button" onClick={() => setCurrentView('cart')}>
                        <i className="fas fa-shopping-cart"></i>
                    </button>
                </div>
                <h2>User Dashboard</h2>

                <div className="search-section">
                    <h3>Search Products</h3>

                    <Search onSearch={handleSearch} />

                    <ul className="product-list">
                        {products.map((product) => (
                            <li key={product.productID} className="product-item">
                                {product.product_name} - Price: Rs.{product.price}
                                <div>
                                    <input
                                        type="number"
                                        min="1"
                                        // value={productQuantities[product.productID] || 1}
                                        onChange={(e) => handleQuantityChange(product.productID, e.target.value)}
                                        className="quantity-input"
                                    />
                                    <button onClick={() => handleAddToCart(product.productID, productQuantities[product.productID])}
                                        className="user-button">Add to Cart</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {currentView === 'cart' && (
                    <div className="user-section">
                        <h3>Your Cart</h3>
                        <ul className="cart-list">
                            {cart.map((item) => (
                                <li key={item.productID} className="cart-item">
                                    {item.product_name} - {item.quantity}
                                    <button onClick={() => handleUpdateCart(item.productID, item.quantity + 1)} className="user-button">+</button>
                                    <button onClick={() => handleUpdateCart(item.productID, item.quantity - 1)} className="user-button">-</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {currentView === 'orders' && (
                    <div className="user-section">
                        <h3>Your Orders</h3>
                        <ul className="order-list">
                            {orders.map((order, index) => (
                                <li key={index} className="order-item">
                                    {order.product_name} - {order.quantity}
                                    <button onClick={() => handleCancelOrder(order.orderID)} className="user-button">Cancel Order</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
