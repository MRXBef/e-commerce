import React, { useEffect, useState } from "react";
import "../css/pages-css/ProfilePage.css";
import Header from "../components/Header";
import {
  axiosInterceptors,
  decodeToken,
  refreshToken,
} from "../utils/tokenHandler";
import PageLoader from "../components/PageLoader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import avatar from "../assets/img/avatar.png";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import rupiahFormat from "../utils/rupiahFormat";
import Card from "../components/Card";

const ProfilePage = () => {
  //auth state
  const [authorized, setAuthorized] = useState(false);
  const [checkIsAuthorized, setCheckAuthorized] = useState(true);
  const [token, setToken] = useState(null);
  const [expire, setExpire] = useState(0);

  //this state
  const [user, setUser] = useState({
    username: "",
    email: "",
    avatar: null,
    balance: 0,
    followings: [],
    followeds: [],
    products: [],
    carts: [],
  });
  const [userProducts, setUserProducts] = useState([]);

  //inisialisasi axios interceptors
  const axiosJWT = axiosInterceptors({ expire, setToken, setExpire });
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken({ setAuthorized, setCheckAuthorized, setExpire, setToken });
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!authorized && !checkIsAuthorized) {
      navigate("/login");
    }
  }, [authorized, checkIsAuthorized, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_BASEURL}/user`
      );
      setUser({
        username: response.data.username,
        email: response.data.email,
        avatar: response.data.avatar,
        balance: response.data.balance,
        followings: response.data.followings,
        followeds: response.data.followeds,
        products: response.data.products,
        carts: response.data.carts,
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleAvatar = () => {
    if (user.avatar === null) {
      return avatar;
    }
    return `${import.meta.env.VITE_BASEURL}/user/avatar/${user.avatar}`;
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

  // Jangan render halaman jika tidak authorized (taruh di halaman khusus untuk user yang sudah ter authorized)
  if (!authorized) {
    return null;
  }

  console.log(user);

  return (
    <div className="profile-container">
      <Header
        args={{
          isAuthorized: authorized,
          token: decodeToken(token),
        }}
      />

      <div className="content-container">
        <div className="profile-info-container">
          <div className="profile-avatar">
            <img src={handleAvatar()} />
          </div>
          <div className="profile-status">
            <div className="profile-biodata">
              <h1>{user.username}</h1>
              <h1 style={{ fontSize: "15px", color: "var(--info-color)" }}>
                {user.followeds.length} pengikut | {user.followings.length}{" "}
                mengikuti
              </h1>
            </div>
          </div>
          <div className="profile-menu">
            <h1
              style={{
                fontSize: "15px",
                color: "#fff",
                borderRadius: "5px",
                padding: "0px 5px 0px 5px",
                backgroundColor: "var(--warning-color)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {rupiahFormat(user.balance)}
            </h1>
            <i style={{ position: "relative" }}>
              <p
                style={{
                  position: "absolute",
                  fontSize: "10px",
                  padding: "0px 6px 0px 6px",
                  backgroundColor: "var(--warning-color)",
                  borderRadius: "50%",
                  bottom: "-5px",
                  right: "-5px",
                }}
              >
                {user.carts.length}
              </p>
              <CIcon icon={icon.cilCart} />
            </i>
            <i>
              <CIcon icon={icon.cilSettings} />
            </i>
          </div>
        </div>

        <div className="product-title-container">
          <h1>Produk Kamu</h1>
        </div>
        <div className="product-container">
          {user.products.map((product, index) => (
            <Card
              key={index}
              args={{
                isOwnProduct: true,
                totalOfProduct: user.products.length,
                productTitle: product.name,
                productThumbnail: `${
                  import.meta.env.VITE_BASEURL
                }/product/image/${product.images[0].file_name}`,
                ownerAvatar: `${import.meta.env.VITE_BASEURL}/user/avatar/${
                  user.avatar
                }`,
                productPrice: rupiahFormat(product.price),
                productDiscount: product.discount,
                productUuid: product.uuid,
                productOwner: product.owner,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
