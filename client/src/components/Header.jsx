import React, { useState } from "react";
import "../css/Header.css";
import logoProduct from "../assets/img/logo-product.png";
import InputTextWithICon from "./InputTextWithICon";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('')

  const Search = async(e) => {
    e.preventDefault()

  }

  return (
    <div className="header-container">
      <div className="logo-container">
        <img src={logoProduct} onClick={() => navigate("/")} />
      </div>
      <div className="search-container">
        <form onSubmit={Search}>
          <InputTextWithICon
            iconName={icon.cilSearch}
            iconColor={"var(--danger-color)"}
            width={"100%"}
            placeholder={"Cari barang"}
            event={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </div>
      <div className="personal-container">
        <button onClick={() => navigate('/login')}>
          <p>MASUK</p>
          <i style={{ color: "#fff" }}>
            <CIcon icon={icon.cilDoor} />
          </i>
        </button>
      </div>
    </div>
  );
};

export default Header;
