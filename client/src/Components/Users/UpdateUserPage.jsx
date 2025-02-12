import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ValidationForm from "../../Validation"; 

const UpdateUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(`http://localhost:8080/user-router/`)
      .then((response) => response.json())
      .then((data) => {
        const user = data.data.find((user) => user._id === id);
        if (user) {
          setUserData({ username: user.username, email: user.email, password: "" });
        }
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // **Validation**
    const validationErrors = {};
    const nameError = ValidationForm.validateName(userData.username);
    const emailError = ValidationForm.validateEmail(userData.email);
    const passwordError = userData.password ? ValidationForm.validatePass(userData.password) : true;

    if (nameError !== true) validationErrors.username = nameError;
    if (emailError !== true) validationErrors.email = emailError;
    if (passwordError !== true) validationErrors.password = passwordError;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const updatedData = { username: userData.username, email: userData.email };
      if (userData.password) updatedData.password = userData.password; 

      await fetch(`http://localhost:8080/user-router/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 md:p-14 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Update User</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-black font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter new username"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-black font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter new email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-black font-medium">New Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter new password (optional)"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 text-lg font-semibold"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserPage;
