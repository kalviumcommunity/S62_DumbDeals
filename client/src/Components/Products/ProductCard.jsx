/* eslint-disable react/prop-types */
const ProductCard = ({ product }) => {
  return (
    <div className="product-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="product-image w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="product-name text-xl font-bold text-black">{product.name}</h3>
      <p className="product-price text-gray-700 mt-2">Price: ${product.price}</p>
      <p className="product-points text-green-600 font-semibold mt-2">
        Earn {product.points} points!
      </p>
      <p className="product-description text-gray-600 mt-4">{product.description}</p>
      {product.badge && (
        <span className="product-badge mt-4 inline-block bg-black text-white py-1 px-3 text-sm rounded-lg">
          {product.badge}
        </span>
      )}
    </div>
  );
};

export default ProductCard;
