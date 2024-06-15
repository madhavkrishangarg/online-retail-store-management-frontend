import React from 'react';
import './SearchResults.css';

function SearchResults({ results }) {
    return (
        <div className="search-results">
            {results.length > 0 ? (
                <ul>
                    {results.map((product) => (
                        <li key={product.productID} className="product-item">
                        <span className="product-name">{product.product_name}</span>
                        <span className="product-price">Price: {product.price}</span>
                    </li>
                    ))}
                </ul>
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
}

export default SearchResults;
