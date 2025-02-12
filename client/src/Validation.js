const ValidationForm = {
  validateName: (name) => {
    const nameRegex = /^[a-zA-Z][a-zA-Z\s'-]{1,49}$/;
    if (name.length < 2) return 'Name cannot be less than 2 letters';
    if (!nameRegex.test(name)) return 'Name should not contain symbols';
    return true;
  },

  validateEmail: (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email.length > 254) return 'Email is too long';
    if (!emailRegex.test(email)) return 'Invalid email format (e.g., name@example.com)';
    return true;
  },

  validatePass: (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (password.length > 128) return 'Password must be less than 128 characters';
    if (!hasLowerCase) return 'Password must contain a lowercase letter';
    if (!hasUpperCase) return 'Password must contain an uppercase letter';
    if (!hasNumber) return 'Password must contain a number';
    if (!hasSpecialChar) return 'Password must contain a special character';
    return true;
  }
};

export default ValidationForm;
