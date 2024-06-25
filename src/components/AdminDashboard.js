import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import dotenv from 'dotenv';

dotenv.config();


function AdminDashboard() {
    const [product, setProduct] = useState({ name: '', price: 0, quantity: 0 });
    const [category, setCategory] = useState({ name: '', info: '' });
    const [productCategoryMap, setProductCategoryMap] = useState({ productID: '', categoryID: '' });
    const [updatePrice, setUpdatePrice] = useState({ productID: '', price: 0 });
    const [addQuantity, setAddQuantity] = useState({ productID: '', quantity: 0 });
    const [olap1Data, setOlap1Data] = useState([]);
    const [olap2Data, setOlap2Data] = useState([]);
    const [olap3Data, setOlap3Data] = useState([]);
    const [groupedData, setGroupedData] = useState([]);
    const [year, setYear] = useState(2024);
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

    const fetchOlap1Data = async () => {
        try {
            const response = await axios.get('http://${process.env.domain}/api/olap1');
            setOlap1Data(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching OLAP1 data:', error);
        }
    };

    const fetchOlap2Data = async () => {
        // console.log(year);
        try {
            const response = await axios.post('http://${process.env.domain}/api/olap2', { year });
            setOlap2Data(response.data);
        } catch (error) {
            console.error('Error fetching OLAP2 data:', error);
        }
    };

    const fetchOlap3Data = async () => {
        try {
            const response = await axios.get('http://${process.env.domain}/api/olap3');
            setOlap3Data(response.data);
            // setGroupedData(olap3data.reduce((acc, item) => {
            //     const category = item.Category || 'No Category';
            //     if (!acc[category]) {
            //         acc[category] = [];
            //     }
            //     acc[category].push(item);
            //     return acc;
            // }, {});)
            setGroupedData(response.data.reduce((acc, item) => {
                const category = item.Category || 'No Category';
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(item);
                return acc;
            }, {}));

        } catch (error) {
            console.error('Error fetching OLAP3 data:', error);
        }
    };

    const handleAddProduct = async () => {
        const adminID = localStorage.getItem('adminID');
        if (!adminID) {
            navigate('/admin-login');
            return;
        }
        try {
            const response = await axios.post('http://${process.env.domain}/api/add_product', { ...product, adminID });
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
            const response = await axios.post('http://${process.env.domain}/api/add_category', { ...category, adminID });
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
            await axios.post('http://${process.env.domain}/api/map_product-category', { ...productCategoryMap, adminID });
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
            await axios.put(`http://${process.env.domain}/api/update_price/${updatePrice.productID}`, { adminID, price: updatePrice.price });
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
            await axios.put(`http://${process.env.domain}/api/add_quantity/${addQuantity.productID}`, { adminID, quantity: addQuantity.quantity });
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

                <div className="admin-section">
                    <h3>Get Sales Data</h3>
                    <div className="olap-section">
                        <div className="input-group">
                            <h4 style={{ marginRight: "2em" }}>Total Quantity and Sales by Category</h4>
                            <button onClick={fetchOlap1Data} className="admin-button">Fetch Data</button>
                        </div>
                        <ul className='olap-list'>
                            {olap1Data.map((item, index) => (
                                <li key={index} className='olap-item'>{item.category} - {item.total_sales}</li>
                            ))}
                        </ul>



                    </div>
                    <div className="olap-section">
                        <div className='input-group'> <h4>Monthly Unique Customers and Total Sales</h4>
                            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="year-input" />
                            <button onClick={fetchOlap2Data} className="admin-button" style={{ marginLeft: '2em' }}>Fetch Data</button>
                        </div>
                        <ul className='olap-list'>
                            {olap2Data.map((item, index) => (
                                <li key={index} className='olap-item2'>
                                    {item.year === null ? `Summary` : `Year: ${item.year}`}
                                    {item.month === null ? '' : `, Month: ${item.month}`} - Unique Customers: {item.unique_customers}, Total Sales: {item.total_sales}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="olap-section">
                        <div className="input-group">
                            <h4 style={{ marginRight: "2em" }}>Monthly Revenue by Category with Subtotals and Grand Total</h4>
                            <button onClick={fetchOlap3Data} className="admin-button">Fetch Data</button>
                        </div>
                        <ul>
                            {
                                Object.keys(groupedData).map((category, index) => (
                                    <div key={index}>
                                        <h3>{category}</h3>
                                        <ul className='olap-list'>
                                            {groupedData[category].map((item, idx) => (
                                                <li key={idx} className='olap-item'>
                                                    {item.Year ? `Year: ${item.Year}` : ''}
                                                    {item.Month ? `, Month: ${item.Month}` : ''}
                                                    - Revenue: {item.Revenue}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
