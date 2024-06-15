import React from 'react';

function SearchResults({ results }) {
    return (
        <div className="search-results">
            {results.length > 0 ? (
                <ul>
                    {results.map((product) => (
                        <li key={product.productID}>
                            <h2>{product.product_name}</h2>
                            <p>Price: {product.price}</p>
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
