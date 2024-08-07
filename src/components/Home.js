import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import SearchResults from './SearchResults';
import './Home.css';
import axios from 'axios';


function Home() {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (prompt) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_DOMAIN}/api/search`, { prompt });

            setSearchResults(response.data);

            if(response.data.length === 0){
                alert('No results found');
            }

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
