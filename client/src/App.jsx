import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ProductPage from "./pages/ProductPage";
import BuyNowPage from "./pages/buyNowPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/mprofile" element={<ProfilePage/>} />
          <Route path="/shop/:username" element={<>toko orang</>} />
          <Route path="/product/:product_uuid" element={<ProductPage/>} />
          <Route path="/buy-now" element={<BuyNowPage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
