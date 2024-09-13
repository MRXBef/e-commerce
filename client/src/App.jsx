import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/mprofile" element={<ProfilePage/>} />
          <Route path="/shop/:username" element={<>toko orang</>} />
          <Route path="/product/:product_uuid" element={<>produk</>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
