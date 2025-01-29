import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ValidationForm from "../../Validation"; 

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({}); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFormErrors({}); 

    const validationErrors = {};
    const NameVerify = ValidationForm.validateName(username);
    const EmailVerify = ValidationForm.validateEmail(email);
    const PassVerify = ValidationForm.validatePass(password);
    const confirmPassVerify = password === confirmPassword ? true : "Passwords do not match.";

    if (typeof NameVerify === "string") {
      validationErrors.username = NameVerify;
    }
    if (typeof EmailVerify === "string") {
      validationErrors.email = EmailVerify;
    }
    if (typeof PassVerify === "string") {
      validationErrors.password = PassVerify;
    }
    if (confirmPassVerify !== true) {
      validationErrors.confirmPassword = confirmPassVerify;
    }

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    const userData = { 
      username, 
      email, 
      password,  // Include password in the request
      createdAt: new Date(), 
      updatedAt: new Date() 
    };

    try {
      const response = await fetch("http://localhost:8080/user-router/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Signup failed. Please try again.");

      navigate("/users"); // Redirect to users page after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Create Your Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-black font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter your username"
            />
            {formErrors.username && <p className="text-red-500 text-sm">{formErrors.username}</p>}
          </div>
          
          {/* Email Field */}
          <div>
            <label className="block text-black font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-black font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Create a strong password"
            />
            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-black font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Re-enter password"
            />
            {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 text-lg font-semibold"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-black font-semibold hover:underline">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
