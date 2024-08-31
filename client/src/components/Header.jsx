import React, { useState } from "react";
import "../css/Header.css";
import logoProduct from "../assets/img/logo-product.png";
import InputTextSearch from "./InputTextSearch";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import { useNavigate } from "react-router-dom";

const Header = ({isAuthorize}) => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('')

  const Search = async(e) => {
    e.preventDefault()

    console.log(searchValue)
  }

  return (
    <div className="header-container">
      <div className="logo-container">
        <img src={logoProduct} onClick={() => navigate("/")} />
      </div>
      <div className="search-container">
        <form onSubmit={Search}>
          <InputTextSearch
            args={{
              iconName: icon.cilSearch,
              iconColor: 'var(--secondary-color)',
              width: '100%',
              placeholder: "Cari Barang",
              event: function(e){setSearchValue(e.target.value)}
            }}
          />
        </form>
      </div>
      <div className="personal-container">
        {isAuthorize ? (
          <button>
            <i style={{color: '#fff'}}>
              <CIcon icon={icon.cilUser}/>
            </i>
          </button>
        ) : (
          <button onClick={() => navigate('/login')}>
            <p>MASUK</p>
            <i style={{ color: "#fff" }}>
              <CIcon icon={icon.cilDoor} />
            </i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
