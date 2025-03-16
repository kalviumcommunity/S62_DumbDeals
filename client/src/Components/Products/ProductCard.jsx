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
      // Get the creator ID in string format
      const creatorIdStr = typeof creatorId === 'object' ? creatorId.toString() : creatorId;
      
      // Fetch all users
      const response = await fetch("http://localhost:8080/user-router/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      
      const data = await response.json();
      
      // Find the user with the matching ID
      const creator = data.data.find(user => user._id === creatorIdStr);
      
      // Set the creator name if found
      if (creator) {
        setCreatorName(creator.username);
      }
    } catch (error) {
      console.error("Error fetching creator name:", error);
    }
  };

  return (
    <div className="product-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="product-image w-full h-48 object-cover rounded-md mb-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
        }}
      />
      <h3 className="product-name text-xl font-bold text-black">{product.name}</h3>
      <p className="text-gray-500 text-sm">Created by: {creatorName}</p>
      <p className="product-price text-gray-700 mt-2">Price: ${product.price}</p>
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