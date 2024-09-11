import React, { useState } from "react";
import "../css/pages-css/LoginPage.css";
import loginHero from "../assets/img/login-hero.png";
import logoProduct from "../assets/img/logo-product.png";
import axios from "axios";
import InputTextWithICon from "../components/InputTextWithICon";
import * as icon from "@coreui/icons";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

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
                event: (e) => {setEmail(e.target.value)},
                iconName: icon.cilEnvelopeClosed,
                placeholder: "Email",
                width: "75%",
                type: 'text'
              }}
            />
            <InputTextWithICon
              args={{
                event: (e) => {setPassword(e.target.value)},
                iconName: icon.cilLockLocked,
                placeholder: "Password",
                width: "75%",
                type: 'password'
              }}
            />
            <button type="submit">MASUK</button>
            <div className="switch">
              <p style={{ color: "var(--primary-color)" }}>
                Belum punya akun?{" "}
                <a href="" style={{ color: "var(--info-color)" }}>
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
