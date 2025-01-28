import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import ProductsPage from './Components/Products/ProductPage';
import UsersPage from './Components/Users/UsersPage';

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
              </ul>
            </nav>
          </div>
        </header>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/users" element={<UsersPage/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
