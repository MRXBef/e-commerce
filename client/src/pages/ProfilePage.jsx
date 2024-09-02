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

const ProfilePage = () => {
  //auth state
  const [authorized, setAuthorized] = useState(false);
  const [checkIsAuthorized, setCheckAuthorized] = useState(true);
  const [token, setToken] = useState(null);
  const [expire, setExpire] = useState(0);

  //this state
  const [user, setUser] = useState({
    username: "",
    avatar: null,
    balance: 0,
  });
  const [userProducts, setUserProducts] = useState([]);

  //inisialisasi axios interceptors
  const axiosJWT = axiosInterceptors({ expire, setToken, setExpire });
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken({ setAuthorized, setCheckAuthorized, setExpire, setToken });
  }, []);

  useEffect(() => {
    if (!authorized && !checkIsAuthorized) {
      navigate("/login");
    }
    fetchUserData();
  }, [authorized, checkIsAuthorized, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_BASEURL}/user`
      );
      console.log(response);
    } catch (error) {
      console.log(error.response);
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

  // Jangan render halaman jika tidak authorized (taruh di halaman khusus untuk user yang sudah ter authorized)
  if (!authorized) {
    return null;
  }

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
            <img src={``} />
          </div>
          <div className="profile-status">
            <div>
              <h1>{}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
