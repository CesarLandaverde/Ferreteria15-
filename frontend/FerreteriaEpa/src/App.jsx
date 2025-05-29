import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Products from "./pages/Products.jsx";
import Brand from "./pages/Brands.jsx";
import Reviews from "./pages/Reviews.jsx"; 
import './App.css';

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/products">Productos</Link>
        <Link to="/brands">Marcas</Link>
        <Link to="/reviews">Reviews</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Products />} /> 
        <Route path="/products" element={<Products />} />
        <Route path="/brands" element={<Brand />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </Router>
  );
}

export default App;
