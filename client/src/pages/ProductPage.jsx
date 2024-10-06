import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Alert } from "../components/Alert";

const ProductPage = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);
  const [isPublicUser, setIsPublicUser] = useState(false)
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
  const navigate = useNavigate()
  const {AlertComponent, handleShowAlert} = Alert()

  useEffect(() => {
    refreshToken({ setAuthorized, setCheckAuthorized, setToken, setExpire, setIsPublicUser });
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/product/${product_uuid}`
      );
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

  const handleCartClicked = async () => {
    try {
      const response = await axiosJWT.post(`${import.meta.env.VITE_BASEURL}/cart`, {
        productUuid: product.uuid,
        productOwner: product.user.username
      })
      handleShowAlert(response.data.msg, true)
    } catch (error) {
      if(error.response.status === 401) {
        navigate('/login')
      }
      handleShowAlert(error.response.data.msg, false)
    }
  }

  const handleBuyNow = async() => {
    try {
      const response = await axiosJWT.post(`${import.meta.env.VITE_BASEURL}/transaction`, {
        productUuid: product.uuid,
        productOwner: product.user.username
      })
      if(response.status === 200) {
        navigate('/buy-now')
      }
    } catch (error) {
      if(error.response.status === 401) {
        navigate('/login')
      }
      handleShowAlert(error.response.data.msg, false)
    }
  }

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

  if(!authorized && !isPublicUser) {
    return null
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

      <AlertComponent/>

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
              />
              <i data-name="right" onClick={handleArrowClicked}>
                <CIcon icon={icon.cilArrowRight} />
              </i>
              <i onClick={handleCartClicked}>
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
                <div className="buy-now" onClick={handleBuyNow}>
                  <h1>Beli Sekarang</h1>
                  <i>
                    <CIcon icon={icon.cilCheck}/>
                  </i>
                </div>
                {product.categories.map((category, index) => (
                  <div className="category" key={index}>{category.name.toUpperCase()}</div>
                ))}
              </div>
              <div className="location-container">
                <i style={{color: 'var(--primary-color)'}}>
                  <CIcon icon={icon.cilLocationPin}/>
                </i>
                <h1 style={{color: 'var(--secondary-color)'}}>{product.user.addresss[0].province}</h1>
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
