import React, { useEffect, useState } from "react";
import "../css/pages-css/LoginPage.css";
import loginHero from "../assets/img/login-hero.png";
import logoProduct from "../assets/img/logo-product.png";
import axios from "axios";
import InputTextWithICon from "../components/InputTextWithICon";
import * as icon from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "../utils/tokenHandler";
import PageLoader from "../components/PageLoader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);
  const [isPublicUser, setIsPublicUser] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checkAuthorized, setCheckAuthorized] = useState(true);

  const navigate = useNavigate();

  const Login = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/login`,
        {
          email: email,
          password: password,
        }
      );
      if (response) {
        window.history.length >= 3 ? navigate(-1) : navigate("/");
      }
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  useEffect(() => {
    refreshToken({ setToken, setExpire, setAuthorized, setCheckAuthorized, setIsPublicUser });

    if(authorized && !checkAuthorized) {
      navigate("/")
    }
  }, [authorized, checkAuthorized, navigate]);

  if (checkAuthorized || authorized) {
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
    <div className="login-container">
      <div className="login-box-outer">
        <div className="login-box-inner-hero">
          <img src={loginHero} />
        </div>
        <div className="login-box-inner-form">
          <form onSubmit={Login}>
            <div className="login-title">
              <h1>
                Ayo mulai, <span>temukan barang impian anda!</span>
              </h1>
            </div>
            <InputTextWithICon
              args={{
                event: (e) => {
                  setEmail(e.target.value);
                },
                iconName: icon.cilEnvelopeClosed,
                placeholder: "Email",
                width: "75%",
                type: "text",
              }}
            />
            <InputTextWithICon
              args={{
                event: (e) => {
                  setPassword(e.target.value);
                },
                iconName: icon.cilLockLocked,
                placeholder: "Password",
                width: "75%",
                type: "password",
              }}
            />
            <button type="submit">MASUK</button>
            <div className="switch">
              <p style={{ color: "var(--primary-color)" }}>
                Belum punya akun?{" "}
                <a href="/register" style={{ color: "var(--info-color)" }}>
                  Daftar
                </a>
              </p>
            </div>
            <img
              src={logoProduct}
              style={{ width: "50px", cursor: "pointer" }}
              onClick={() => {
                navigate("/");
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
