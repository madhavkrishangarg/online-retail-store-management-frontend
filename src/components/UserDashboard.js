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
    const [privilege_status, setPrivilege_status] = useState('');
    const [first_name, setFirst_name] = useState('');
    const [payments, setPayments] = useState([]);
    const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userID');
        if (!userId) {
            navigate('/user-login');
            return;
        }

        const fetchFirstName = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_DOMAIN}/api/first_name/${userId}`);
                setFirst_name(response.data[0].first_name);

            } catch (error) {
                console.error(error);
                alert('An error occurred while fetching the first name');
            }
        };

        const fetchPrivilegedData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_DOMAIN}/api/privilege/${userId}`);
                setPrivilege_status(response.data[0].privilege_status);
            } catch (error) {
                console.error(error);
                alert('An error occurred while fetching the privilege status');
            }
        };

        const handlePayment = async () => {
            try {
                const userId = localStorage.getItem('userID');
                const res = await axios.get(`${process.env.REACT_APP_DOMAIN}/api/payment/${userId}`);
                // console.log(res.data);
                setPayments(res.data);
                fetchCart();
            } catch (error) {
                console.error(error);
                alert('An error occurred while fetching payments');
            }
        };

        fetchFirstName();
        fetchPrivilegedData();

        const handleNavigation = () => {
            const currentPath = window.location.pathname;
            if (currentPath !== '/online-retail-store-management-frontend/user-dashboard') {
                localStorage.removeItem('userID');
            }
        };

        window.addEventListener('popstate', handleNavigation);

        if (currentView === 'cart') {
            const intervalId = setInterval(fetchCart, 1000);
            return () => clearInterval(intervalId);
        }

        if (currentView === 'orders') {
            const intervalId = setInterval(fetchOrders, 1000);
            return () => clearInterval(intervalId);
        }

        if (currentView === 'payments') {
            const intervalId = setInterval(handlePayment, 1000);
            return () => clearInterval(intervalId);
        }

        return () => {
            window.removeEventListener('popstate', handleNavigation);
            if (window.location.pathname !== '/online-retail-store-management-frontend/user-dashboard') {
                localStorage.removeItem('userID');
            }
        };
    }, [navigate, currentView]);

    const fetchCart = async () => {
        try {
            const userId = localStorage.getItem('userID');
            const response = await axios.get(`${process.env.REACT_APP_DOMAIN}/api/cart/${userId}`);
            setCart(response.data.cart);
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching the cart');
        }
    };

    const fetchOrders = async () => {
        try {
            const userId = localStorage.getItem('userID');
            const response = await axios.get(`${process.env.REACT_APP_DOMAIN}/api/orders/${userId}`);
            setOrders(response.data);
            // console.log(response.data);
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching the orders');
        }
    };

    const handleSearch = async (prompt) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_DOMAIN}/api/search`, { prompt });
            setProducts(response.data);
        } catch (error) {
            console.error(error);
            alert('An error occurred while searching for products');
        }
    };

    const handleAddToCart = async (productId, quantity) => {
        if (quantity < 1) {
            alert('Quantity should be at least 1');
            return;
        }
        try {
            const userId = localStorage.getItem('userID');
            const res = await axios.post(`${process.env.REACT_APP_DOMAIN}/api/cart/${userId}/${productId}`, { quantity });
            fetchCart();
            alert('Added to cart');
        } catch (error) {
            console.error(error);
            alert(error.response.data || 'An error occurred while adding to the cart');
        }
    };

    const handleUpdateCart = async (productId, quantity) => {
        try {
            const userId = localStorage.getItem('userID');
            await axios.put(`${process.env.REACT_APP_DOMAIN}/api/cart/${userId}/${productId}`, { quantity });
            fetchCart();
            alert('Cart updated');
        } catch (error) {
            console.error(error);
            alert(error.response.data || 'An error occurred while updating the cart');
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const userId = localStorage.getItem('userID');
            await axios.delete(`${process.env.REACT_APP_DOMAIN}/api/cancel_order/${orderId}`, { data: { userID: userId } });
            fetchOrders();
            alert('Order cancelled');
        } catch (error) {
            console.error(error.response.data);
            alert(error.response.data || 'An error occurred while cancelling the order');
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
    };

    const handleDeleteFromCart = async (productId) => {
        try {
            const userId = localStorage.getItem('userID');
            await axios.delete(`${process.env.REACT_APP_DOMAIN}/api/cart/${userId}/${productId}`);
            fetchCart();
            alert('Deleted from cart');
        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting from the cart');
        }
    };

    const handleCheckout = async () => {
        try {
            const userId = localStorage.getItem('userID');
            const res = await axios.post(`${process.env.REACT_APP_DOMAIN}/api/buy_now/${userId}`, {
                coupon,
                mode: paymentMode,
                address
            });
            setShowCheckoutPopup(false);
            fetchCart();
            fetchOrders();

            alert(res.data);

        } catch (error) {
            console.error(error);
            alert(error.response.data || 'An error occurred while checking out');
        }
    };

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
                    <button className="orders-button" onClick={() => setCurrentView('orders')}>
                        <i className="fas fa-box"></i>
                    </button>
                    <button className="payments-button" onClick={() => setCurrentView('payments')}>
                        <i className="fas fa-credit-card"></i>
                    </button>
                </div>
                <h2 style={{ marginBottom: '-0.3em' }}>Welcome, {first_name}</h2>
                <h4 style={{ marginTop: '0.5em' }}>Your Privilege Status: {privilege_status}</h4>
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
                            {cart && cart.length > 0 ? (
                                cart.map((item) => (
                                    <li key={item.productID} className="cart-item">
                                        {item.product_name} - {item.quantity}: ProductID - {item.productID}
                                        <div>
                                            <button onClick={() => handleUpdateCart(item.productID, 1)} className="user-button">+</button>
                                            <button onClick={() => handleUpdateCart(item.productID, -1)} className="user-button">-</button>
                                            <button onClick={() => handleDeleteFromCart(item.productID)} className="user-button">Delete</button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p>No cart items to show.</p>
                            )}
                        </ul>
                        <button onClick={() => setShowCheckoutPopup(true)} className="user-button">Checkout</button>
                        {showCheckoutPopup && (
                            <div className="checkout-popup">
                                <h3>Checkout</h3>
                                <div className="form-group">
                                    <label>Coupon Code:</label>
                                    <input
                                        type="text"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Payment Mode:</label>
                                    <select
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Select Payment Mode</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Debit Card">Debit Card</option>
                                        <option value="Net Banking">Net Banking</option>
                                        <option value="UPI">UPI</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Address:</label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="button-group">
                                    <button onClick={handleCheckout} className="user-button confirm">Confirm Checkout</button>
                                    <button onClick={() => setShowCheckoutPopup(false)} className="user-button cancel">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {currentView === 'orders' && (
                    <div className="user-section">
                        <h3>Your Orders</h3>
                        <ul className="order-list">
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <li key={order.orderID} className="order-item">
                                        Order ID: {order.orderID}
                                        <ul>
                                            {order.products.map((product, index) => (
                                                <li key={index} className="product-item">
                                                    {product.product_name} - {product.total_quantity}
                                                </li>
                                            ))}
                                        </ul>
                                        Total Price: {order.total}
                                        <br />
                                        Delivery Date: {order.delivery_date[0].delivery_date}
                                        <button onClick={() => handleCancelOrder(order.orderID)} className="user-button">Cancel Order</button>
                                    </li>
                                ))
                            ) : (
                                <p>No orders to show.</p>
                            )}

                        </ul>
                    </div>
                )}

                {currentView === 'payments' && (
                    <div className="user-section">
                        <h3>Your Payments</h3>
                        <ul className="payment-list">
                            {payments && payments.length > 0 ? (
                                payments.map((payment, index) => (
                                    <li key={index} className="product-item">
                                        Payment Mode: {payment.payment_mode} | Payment Address: {payment.payment_address} | Order ID: {payment.orderID}
                                    </li>
                                ))
                            ) : (
                                <p>No payments to show.</p>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
