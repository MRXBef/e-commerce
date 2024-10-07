import React, { useEffect, useState } from "react";
import "../css/pages-css/HomePage.css";
import Header from "../components/Header";
import Card from "../components/Card";
import axios from "axios";
import PageLoader from "../components/PageLoader";
import {
  axiosInterceptors,
  decodeToken,
  refreshToken,
} from "../utils/tokenHandler";
import rupiahFormat from "../utils/rupiahFormat";
import { jwtDecode } from "jwt-decode";

const HomePage = () => {
  //auth state
  const [authorized, setAuthorized] = useState(false);
  const [checkAuthorized, setCheckAuthorized] = useState(true);
  const [isPublicUser, setIsPublicUser] = useState(false);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);

  //this state
  const [products, setProducts] = useState([]);
  const [isProductFinished, setIsProductFinished] = useState(false);

  //inisialisasi axios interceptors
  const axiosJWT = axiosInterceptors({ expire, token, setToken, setExpire });

  useEffect(() => {
    refreshToken({
      setAuthorized,
      setCheckAuthorized,
      setExpire,
      setToken,
      setIsPublicUser,
    });
    getProducts(Infinity);
  }, []);

  const getProducts = async (benchmarkId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/product/foryou/${benchmarkId}`
      );
      setProducts(response.data.datas);
      setCheckAuthorized(false);
    } catch (error) {
      console.log(error.response);
      setCheckAuthorized(true);
    }
  };

  const handleShowMore = async (benchmarkId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/product/foryou/${benchmarkId}`
      );
      if (response.status === 204) {
        return setIsProductFinished(true);
      }
      setProducts((prevState) => [...prevState, ...response.data.datas]);
    } catch (error) {
      console.log(error.response);
    }
  };

  if (checkAuthorized) {
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

  if (!authorized && !isPublicUser) {
    return null;
  }

  // console.log(products.length <= 18)

  return (
    <div className="page-container">
      <Header
        args={{
          isAuthorized: authorized,
          token: decodeToken(token),
        }}
      />

      <div className="content-container">
        <div className="highlight-title-container">
          <h1>Untuk Kamu</h1>
        </div>
        <div className="highlight-container">
          {products.map((product, index) => (
            <Card
              key={index}
              args={{
                isOwnProduct: false,
                totalOfProduct: products.length,
                productTitle: product.name,
                productThumbnail: `${
                  import.meta.env.VITE_BASEURL
                }/product/image/${product.thumbnail}`,
                ownerAvatar: `${import.meta.env.VITE_BASEURL}/user/avatar/${
                  product.owner_avatar
                }`,
                productPrice: rupiahFormat(product.price),
                productDiscount: product.discount,
                productUuid: product.uuid,
                productOwner: product.owner,
                productLocation: product.province,
              }}
            />
          ))}
        </div>
        {products.length > 0 && products.length >= 18 && (
          <div className="highlight-more-container">
            {!isProductFinished ? (
              <button
                onClick={() => handleShowMore(products[products.length - 1].id)}
              >
                Lebih banyak
              </button>
            ) : (
              <h1>Tidak ada produk "Untuk Kamu" lagi untuk di muat</h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
