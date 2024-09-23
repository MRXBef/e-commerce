import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/pages-css/ProductPage.css";
import {
  axiosInterceptors,
  decodeToken,
  refreshToken,
} from "../utils/tokenHandler";
import PageLoader from "../components/PageLoader";
import Header from "../components/Header";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import rupiahFormat from "../utils/rupiahFormat";

const ProductPage = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);
  const [authorized, setAuthorized] = useState(false);
  const [checkAuthorized, setCheckAuthorized] = useState(true);
  const { product_uuid } = useParams();
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    user: {},
    images: [],
  });
  const [indexOfImagesShowed, setIndexOfImagesShowed] = useState(0);

  const axiosJWT = axiosInterceptors({ token, setToken, expire, setExpire });

  useEffect(() => {
    refreshToken({ setAuthorized, setCheckAuthorized, setToken, setExpire });
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/product/${product_uuid}`
      );
      // console.log(response)
      setProduct({ ...response.data });
      setIsProductLoading(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleArrowClicked = (event) => {
    const { name } = event.currentTarget.dataset;

    if (
      (indexOfImagesShowed <= 0 && name === "left") ||
      (indexOfImagesShowed >= product.images.length - 1 && name === "right")
    ) {
      return;
    }

    name === "left"
      ? setIndexOfImagesShowed(indexOfImagesShowed - 1)
      : setIndexOfImagesShowed(indexOfImagesShowed + 1);
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

  console.log(product);

  return (
    <div className="page-container">
      <Header
        args={{
          isAuthorized: authorized,
          token: decodeToken(token),
        }}
      />

      {isProductLoading ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PageLoader />
        </div>
      ) : (
        <div className="content-container">
          <div className="product-container">
            <div className="images-container">
              <i data-name="left" onClick={handleArrowClicked}>
                <CIcon icon={icon.cilArrowLeft} />
              </i>
              <img
                src={`${import.meta.env.VITE_BASEURL}/product/image/${
                  product.images[indexOfImagesShowed].file_name
                }`}
                alt="Product Image"
                style={{ pointerEvents: "none" }}
              />
              <i data-name="right" onClick={handleArrowClicked}>
                <CIcon icon={icon.cilArrowRight} />
              </i>
              <i>
                <CIcon icon={icon.cilCart} />
              </i>
              <div className="index-of-images">
                <h1>
                  {indexOfImagesShowed + 1}/{product.images.length}
                </h1>
              </div>
            </div>
            <div className="info-container">
              <div className="price-and-sold">
                {product.discount > 0 ? (
                  <>
                    <div>
                      <h1>
                        {rupiahFormat(
                          product.price - product.price * product.discount
                        )}
                      </h1>
                      <h1 style={{ textDecoration: "line-through" }}>
                        {rupiahFormat(product.price)}
                      </h1>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h1>{rupiahFormat(product.price)}</h1>
                    </div>
                  </>
                )}
                <h1>{product.transactions.length} Terjual</h1>
              </div>
              <div className="product-name">
                <h1>{product.name}</h1>
              </div>
              <div className="product-category">
                {product.categories.map((category, index) => (
                  <div key={index}>{category.name.toUpperCase()}</div>
                ))}
              </div>
              <div className="owner-container">
                <img
                  src={`${import.meta.env.VITE_BASEURL}/user/avatar/${
                    product.user.avatar
                  }`}
                />
                <h1>@{product.user.username}</h1>
              </div>
              <div className="description-container">
                <h1 style={{color: '#000', fontWeight: '500'}}>Deskripsi Produk</h1>
                <h1 style={{color: '#000'}}>
                  {product.description.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
