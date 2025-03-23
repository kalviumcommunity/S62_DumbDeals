import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProductsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // Assuming user ID is stored in localStorage after login.

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError("You must be logged in to add a product.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/product-router/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, created_by: userId }),
      });

      if (!response.ok) throw new Error("Failed to add product. Try again.");
      navigate("/products"); // Redirect to product page after adding
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Add a Product</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {["name", "price", "description", "image"].map((field) => (
            <div key={field}>
              <label className="block font-medium capitalize">{field}</label>
              <input
                type={field === "price" ? "number" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductsPage;