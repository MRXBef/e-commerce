import React from "react";
import "../css/pages/LoginPage.css";
import loginHero from '../assets/img/login-hero.png'

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
                    <h1>Login</h1>
                </div>
                <input type="text" placeholder="username"/>
                <input type="text" placeholder="password"/>
                <button type="submit">LOGIN</button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
