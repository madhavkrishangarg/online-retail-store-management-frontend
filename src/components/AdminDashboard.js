import React, { useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [product, setProduct] = useState({ name: '', price: 0, quantity: 0 });
    const [category, setCategory] = useState({ name: '', info: '' });
    const [productCategoryMap, setProductCategoryMap] = useState({ productId: '', categoryId: '' });

    const handleAddProduct = async () => {
        try {
            await axios.post('/products/add', product);
            alert('Product added successfully');
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const handleAddCategory = async () => {
        try {
            await axios.post('/category/add', category);
            alert('Category added successfully');
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const handleLinkProductCategory = async () => {
        try {
            await axios.post('/category/link', productCategoryMap);
            alert('Product linked to category successfully');
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <div>
                <h3>Add Product</h3>
                <input type="text" placeholder="Product Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                <input type="number" placeholder="Price" value={product.price} onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })} />
                <input type="number" placeholder="Quantity" value={product.quantity} onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })} />
                <button onClick={handleAddProduct}>Add Product</button>
            </div>
            <div>
                <h3>Add Category</h3>
                <input type="text" placeholder="Category Name" value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} />
                <input type="text" placeholder="Info" value={category.info} onChange={(e) => setCategory({ ...category, info: e.target.value })} />
                <button onClick={handleAddCategory}>Add Category</button>
            </div>
            <div>
                <h3>Link Product and Category</h3>
                <input type="text" placeholder="Product ID" value={productCategoryMap.productId} onChange={(e) => setProductCategoryMap({ ...productCategoryMap, productId: e.target.value })} />
                <input type="text" placeholder="Category ID" value={productCategoryMap.categoryId} onChange={(e) => setProductCategoryMap({ ...productCategoryMap, categoryId: e.target.value })} />
                <button onClick={handleLinkProductCategory}>Link Product and Category</button>
            </div>
        </div>
    );
}

export default AdminDashboard;
