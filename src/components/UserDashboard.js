import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchPrompt, setSearchPrompt] = useState('');
    const userId = localStorage.getItem('userID');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate('/user-login');
            return;
        }

        fetchCart();
        fetchOrders();

        const handleBeforeUnload = () => {
            localStorage.removeItem('userID');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            localStorage.removeItem('userID');
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [userId, navigate]);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`/cart/${userId}`);
            setCart(response.data);
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching the cart');
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`/orders/${userId}`);
            setOrders(response.data);
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching the orders');
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/products/search?prompt=${searchPrompt}`);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
            alert('An error occurred while searching for products');
        }
    };

    const handleAddToCart = async (productId, quantity) => {
        try {
            await axios.post('/cart/add', { userId, productId, quantity });
            fetchCart();
        } catch (error) {
            console.error(error);
            alert('An error occurred while adding to cart');
        }
    };

    const handleUpdateCart = async (productId, quantity) => {
        try {
            await axios.post('/cart/update', { userId, productId, quantity });
            fetchCart();
        } catch (error) {
            console.error(error);
            alert('An error occurred while updating the cart');
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.post('/order/cancel', { orderId });
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert('An error occurred while canceling the order');
        }
    };

    return (
        <div>
            <h2>User Dashboard</h2>
            <div>
                <h3>Search Products</h3>
                <input type="text" placeholder="Search" value={searchPrompt} onChange={(e) => setSearchPrompt(e.target.value)} />
                <button onClick={handleSearch}>Search</button>
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            {product.name} - ${product.price}
                            <button onClick={() => handleAddToCart(product.id, 1)}>Add to Cart</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Your Cart</h3>
                <ul>
                    {cart.map((item) => (
                        <li key={item.productId}>
                            {item.productName} - {item.quantity}
                            <button onClick={() => handleUpdateCart(item.productId, item.quantity + 1)}>+</button>
                            <button onClick={() => handleUpdateCart(item.productId, item.quantity - 1)}>-</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Your Orders</h3>
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            Order #{order.id} - {order.status}
                            <button onClick={() => handleCancelOrder(order.id)}>Cancel Order</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default UserDashboard;
