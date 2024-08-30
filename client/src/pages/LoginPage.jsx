import React from "react";
import "../css/pages/LoginPage.css";
import loginHero from "../assets/img/login-hero.png";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-box-outer">
        <div className="login-box-inner-hero">
          <img src={loginHero} />
        </div>
        <div className="login-box-inner-form">
          <form>
            <div className="login-title">
              <h1>Ayo, shoping :)</h1>
            </div>
            <div className="input-container">
                <span className="iconku">🔒</span>
                <input type="text" placeholder="email" />
            </div>
            <div className="input-container">
                <span className="iconku">🔒</span>
                <input type="text" placeholder="password" />
            </div>
            <button type="submit">LOGIN</button>
            <div className="switch">
              <p>
                Belum punya akun? <a href="">Daftar</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
