// components/Search.js
import React, { useState } from 'react';

function Search({ onSearch }) {
    const [prompt, setPrompt] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(prompt);
    };

    return (
        <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Search for products..."
                className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
}

export default Search;
