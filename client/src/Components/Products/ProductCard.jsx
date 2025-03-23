/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const ProductCard = ({ product }) => {
  const [creatorName, setCreatorName] = useState("Unknown User");
  
  useEffect(() => {
    // Only fetch the username if there's a creator ID
    if (product.created_by) {
      fetchCreatorName(product.created_by);
    }
  }, [product.created_by]);

  const fetchCreatorName = async (creatorId) => {
    try {
      // Fetch single user by ID
      const response = await fetch(`http://localhost:8080/user-router/${creatorId}`);
      if (!response.ok) {
        // Fallback to fetching all users if the direct fetch fails
        const allUsersResponse = await fetch("http://localhost:8080/user-router");
        const allUsersData = await allUsersResponse.json();
        const creator = allUsersData.data.find(user => user.id === creatorId);
        if (creator) {
          setCreatorName(creator.name);
        }
        return;
      }
      
      const data = await response.json();
      if (data.data && data.data.name) {
        setCreatorName(data.data.name);
      }
    } catch (error) {
      console.error("Error fetching creator name:", error);
    }
  };

  return (
    <div className="product-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <img
        src={product.image || "https://via.placeholder.com/300x200?text=Image+Not+Available"}
        alt={product.name}
        className="product-image w-full h-48 object-cover rounded-md mb-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
        }}
      />
      <h3 className="product-name text-xl font-bold text-black">{product.name}</h3>
      <p className="text-gray-500 text-sm">Created by: {creatorName}</p>
      <p className="product-price text-gray-700 mt-2">Price: ${parseFloat(product.price).toFixed(2)}</p>
      <p className="product-points text-green-600 font-semibold mt-2">
        Earn {Math.floor(product.price / 2)} points!
      </p>
      <p className="product-description text-gray-600 mt-4">{product.description}</p>
      {product.price > 50 && (
        <span className="product-badge mt-4 inline-block bg-black text-white py-1 px-3 text-sm rounded-lg">
          Premium Item
        </span>
      )}
    </div>
  );
};

export default ProductCard;