import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import SearchResults from './SearchResults';
import './Home.css';

function Home() {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (prompt) => {
        try {
            const response = await fetch(`/api/products?search=${prompt}`);
            const results = await response.json();
            setSearchResults(results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to the E-commerce App</h1>
            </header>
            <main className="home-main">
                <Search onSearch={handleSearch} />
                <SearchResults results={searchResults} />
                <div className="home-links">
                <Link to="/user-login">
                    <button className="home-button">User Login</button>
                </Link>
                <Link to="/admin-login">
                    <button className="home-button">Admin Login</button>
                </Link>
                </div>
            </main>
        </div>
    );
}

export default Home;
