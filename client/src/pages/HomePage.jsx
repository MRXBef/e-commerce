import React, { useEffect, useState } from "react";
import "../css/pages-css/HomePage.css";
import Header from "../components/Header";
import Card from "../components/Card";
import axios from "axios";
import PageLoader from "../components/PageLoader";
import { axiosInterceptors, decodeToken, refreshToken } from "../utils/tokenHandler";
import rupiahFormat from "../utils/rupiahFormat";
import { jwtDecode } from "jwt-decode";

const HomePage = () => {
  //auth state
  const [authorized, setAuthorized] = useState(false);
  const [checkIsAuthorized, setCheckAuthorized] = useState(true);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState(0);

  //root state
  const [products, setProducts] = useState([]);

  //inisialisasi axios interceptors
  const axiosJWT = axiosInterceptors({ expire, token, setToken, setExpire });

  useEffect(() => {
    refreshToken({setAuthorized, setCheckAuthorized, setExpire, setToken});
    getProducts()
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/product`
      );
      setProducts(response.data.datas);
      setCheckAuthorized(false);
    } catch (error) {
      console.log(error.response);
      setCheckAuthorized(true);
    }
  };

  if (checkIsAuthorized) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <Header args={{
        isAuthorized: authorized,
        token: decodeToken(token)
      }} />

      <div className="content-container">
        <div className="highlight-title-container">
          <h1>Produk Terlaris</h1>
        </div>
        <div className="highlight-container">
          {products.map((product, index) => (
            <Card
              key={index}
              args={{
                isOwnProduct: false,
                totalOfProduct: products.length,
                productTitle: product.name,
                productThumbnail: `${import.meta.env.VITE_BASEURL}/product/image/${
                  product.thumbnail
                }`,
                ownerAvatar: `${import.meta.env.VITE_BASEURL}/user/avatar/${product.owner_avatar}`,
                productPrice: rupiahFormat(product.price),
                productDiscount: product.discount,
                productUuid: product.uuid,
                productOwner: product.owner
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
