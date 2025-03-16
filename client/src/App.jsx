import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import ProductsPage from './Components/Products/ProductPage';
import UsersPage from './Components/Users/UsersPage';
import SignupPage from './Components/Authentication/Signup';
import LoginPage from './Components/Authentication/Login';
import UpdateUserPage from './Components/Users/UpdateUserPage';
import AddProductsPage from './Components/Products/AddProducts';

const App = () => {
  return (
    <Router>
      <div className="font-sans bg-white text-black">
        {/* Navigation */}
        <header className="bg-black text-white py-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">DumbDeals</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:underline">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/users" className="hover:underline">
                    Users
                  </Link>
                </li>
                <li>
                  <Link to="/add-product" className="hover:underline">
                    Add Product
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/users" element={<UsersPage/>}/>
          <Route path="/update-user/:id" element={<UpdateUserPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} /> {/* Add Login Page Route */}
          <Route path="/add-product" element={<AddProductsPage/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
