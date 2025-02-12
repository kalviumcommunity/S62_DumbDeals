import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ValidationForm from "../../Validation";

const SignupPage = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage(null);

    // Validate inputs
    const validationErrors = {};
    const nameError = ValidationForm.validateName(formData.username);
    const emailError = ValidationForm.validateEmail(formData.email);
    const passwordError = ValidationForm.validatePass(formData.password);
    const confirmPasswordError = formData.password === formData.confirmPassword ? true : "Passwords do not match";

    if (nameError !== true) validationErrors.username = nameError;
    if (emailError !== true) validationErrors.email = emailError;
    if (passwordError !== true) validationErrors.password = passwordError;
    if (confirmPasswordError !== true) validationErrors.confirmPassword = confirmPasswordError;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user-router/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password })
      });

      if (!response.ok) throw new Error("Signup failed. Please try again.");

      navigate("/users");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Account</h2>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {["username", "email", "password", "confirmPassword"].map((field) => (
            <div key={field}>
              <label className="block font-medium capitalize">{field.replace("confirmPassword", "Confirm Password")}</label>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder={`Enter your ${field.replace("confirmPassword", "password again")}`}
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
