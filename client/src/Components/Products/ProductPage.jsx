import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
        fetchProducts();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/user-router/users");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setUsers(data?.data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchProducts = async (userId = "") => {
        setLoading(true);
        try {
            const url = userId
                ? `http://localhost:8080/product-router/user/${userId}`
                : "http://localhost:8080/product-router/all";

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setProducts(data?.data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="products-page bg-gray-100 min-h-screen py-12">
            <div className="container mx-auto">
                <h1 className="products-title text-4xl font-bold text-black text-center mb-8">
                    Our Absurd Products
                </h1>

                {/* Dropdown to Select User */}
                <div className="text-center mb-6">
                    <label className="text-lg font-semibold">Filter by User:</label>
                    <select
                        onChange={(e) => {
                            setSelectedUser(e.target.value);
                            fetchProducts(e.target.value);
                        }}
                        value={selectedUser}
                        className="ml-4 p-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">All Users</option>
                        {users?.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    </div>
                ) : (
                    <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))
                        ) : (
                            <p className="text-black text-center col-span-full text-xl font-medium py-8">
                                No products found for this user.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;