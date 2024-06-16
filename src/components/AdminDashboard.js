import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
    const [product, setProduct] = useState({ name: '', price: 0, quantity: 0 });
    const [category, setCategory] = useState({ name: '', info: '' });
    const [productCategoryMap, setProductCategoryMap] = useState({ productID: '', categoryID: '' });
    const [updatePrice, setUpdatePrice] = useState({ productID: '', price: 0 });
    const [addQuantity, setAddQuantity] = useState({ productID: '', quantity: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const adminID = localStorage.getItem('adminID');
        if (!adminID) {
            navigate('/admin-login');
            return;
        }

        const handleNavigation = () => {
            const currentPath = window.location.pathname;
            if (currentPath !== '/admin-dashboard') {
                localStorage.removeItem('adminID');
            }
        };

        window.addEventListener('popstate', handleNavigation);

        return () => {
            window.removeEventListener('popstate', handleNavigation);
            if (window.location.pathname !== '/admin-dashboard') {
                localStorage.removeItem('adminID');
            }
        };
    }, [navigate]);

    const handleAddProduct = async () => {
        const adminID = localStorage.getItem('adminID');
        if (!adminID) {
            navigate('/admin-login');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/add_product', { ...product, adminID });
            alert('Product added successfully, new product ID: ' + response.data.productID);
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const handleAddCategory = async () => {
        const adminID = localStorage.getItem('adminID');
        if (!adminID) {
            navigate('/admin-login');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/add_category', { ...category, adminID });
            alert('Category added successfully, new category ID: ' + response.data.categoryID);
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const handleLinkProductCategory = async () => {
        const adminID = localStorage.getItem('adminID');
        if (!adminID) {
            navigate('/admin-login');
            return;
        }
        try {
            await axios.post('http://localhost:3000/api/map_product-category', { ...productCategoryMap, adminID });
            alert('Product linked to category successfully');
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const handleUpdatePrice = async () => {
        const adminID = localStorage.getItem('adminID');
        if (!adminID) {
            navigate('/admin-login');
            return;
        }
        try {
            await axios.put(`http://localhost:3000/api/update_price/${updatePrice.productID}`, { adminID, price: updatePrice.price });
            alert('Price updated successfully');
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const handleAddQuantity = async () => {
        const adminID = localStorage.getItem('adminID');
        if (!adminID) {
            navigate('/admin-login');
            return;
        }
        try {
            await axios.put(`http://localhost:3000/api/add_quantity/${addQuantity.productID}`, { adminID, quantity: addQuantity.quantity });
            alert('Quantity added successfully');
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const handleInputChange = (setter) => (e) => {
        const { name, value, type } = e.target;
        if (type === 'number' && value < 0) {
            alert('Value cannot be negative');
            return;
        }
        setter((prevState) => ({ ...prevState, [name]: type === 'number' ? Number(value) : value }));
    };

    return (
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-card">
                <button className="back-arrow logout-btn" onClick={() => navigate('/')}>
                    <i className="fas fa-sign-out-alt"></i>
                </button>
                <h2>Admin Dashboard</h2>

                <div className="admin-section">
                    <h3>Add Product</h3>
                    <div className="input-group">
                        <label>Product Name</label>
                        <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleInputChange(setProduct)} className="admin-input" />
                        <label>Price</label>
                        <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleInputChange(setProduct)} className="admin-input" />
                        <label>Quantity</label>
                        <input type="number" name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleInputChange(setProduct)} className="admin-input" />
                        <button onClick={handleAddProduct} className="admin-button">Add Product</button>
                    </div>
                </div>

                <div className="admin-section">
                    <h3>Add Category</h3>
                    <div className="input-group">
                        <label>Category Name</label>
                        <input type="text" name="name" placeholder="Category Name" value={category.name} onChange={handleInputChange(setCategory)} className="admin-input" />
                        <label>Info</label>
                        <input type="text" name="info" placeholder="Info" value={category.info} onChange={handleInputChange(setCategory)} className="admin-input" />
                        <button onClick={handleAddCategory} className="admin-button">Add Category</button>
                    </div>
                </div>

                <div className="admin-section">
                    <h3>Link Product and Category</h3>
                    <div className="input-group">
                        <label>Product ID</label>
                        <input type="text" name="productID" placeholder="Product ID" value={productCategoryMap.productID} onChange={handleInputChange(setProductCategoryMap)} className="admin-input" />
                        <label>Category ID</label>
                        <input type="text" name="categoryID" placeholder="Category ID" value={productCategoryMap.categoryID} onChange={handleInputChange(setProductCategoryMap)} className="admin-input" />
                        <button onClick={handleLinkProductCategory} className="admin-button">Link Product and Category</button>
                    </div>
                </div>

                <div className="admin-section">
                    <h3>Update Price</h3>
                    <div className="input-group">
                        <label>Product ID</label>
                        <input type="text" name="productID" placeholder="Product ID" value={updatePrice.productID} onChange={handleInputChange(setUpdatePrice)} className="admin-input" />
                        <label>New Price</label>
                        <input type="number" name="price" placeholder="New Price" value={updatePrice.price} onChange={handleInputChange(setUpdatePrice)} className="admin-input" />
                        <button onClick={handleUpdatePrice} className="admin-button">Update Price</button>
                    </div>
                </div>

                <div className="admin-section">
                    <h3>Add Quantity</h3>
                    <div className="input-group">
                        <label>Product ID</label>
                        <input type="text" name="productID" placeholder="Product ID" value={addQuantity.productID} onChange={handleInputChange(setAddQuantity)} className="admin-input" />
                        <label>Quantity</label>
                        <input type="number" name="quantity" placeholder="Quantity" value={addQuantity.quantity} onChange={handleInputChange(setAddQuantity)} className="admin-input" />
                        <button onClick={handleAddQuantity} className="admin-button">Add Quantity</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
