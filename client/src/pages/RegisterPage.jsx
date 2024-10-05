import React, { useEffect, useState } from "react";
import { refreshToken } from "../utils/tokenHandler";
import { useNavigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import "../css/pages-css/RegisterPage.css";
import InputTextWithIcon from "../components/InputTextWithICon";
import loginHero from "../assets/img/login-hero.png";
import logoProduct from "../assets/img/logo-product.png";
import axios from "axios";
import * as icon from "@coreui/icons";
import { Alert } from "../components/Alert";

const RegisterPage = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);
  const [authorized, setAuthorized] = useState(false);
  const [checkAuthorized, setCheckAuthorized] = useState(true);
  const [isPublicUser, setIsPublicUser] = useState(false);

  //this state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [listProvincies, setListProvincies] = useState([]);
  const [selectedProvincies, setSelectedProvincies] = useState(null);
  const [listCities, setListCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState(null);

  const navigate = useNavigate();
  const { handleShowAlert, AlertComponent } = Alert();

  useEffect(() => {
    refreshToken({
      setToken,
      setExpire,
      setAuthorized,
      setCheckAuthorized,
      setIsPublicUser,
    });

    getProvincies();

    if (authorized && !checkAuthorized) {
      navigate("/");
    }
  }, [authorized, checkAuthorized, navigate]);

  const getProvincies = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/location/provincies`
      );
      setListProvincies(response.data.provincies);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleProvinciesOnChange = async (e) => {
    const { value } = e.target;
    if (value === "") {
      setListCities([]);
      setSelectedProvincies(null);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/location/cities/${value}`
      );
      if (response) {
        setSelectedProvincies(value);
        setListCities(response.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCitiesOnChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      setSelectedCities(null);
      return;
    }
    setSelectedCities(value);
  };

  const Register = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASEURL}/register`, {
        email: email,
        password: password,
        confPassword: confPassword,
        province: selectedProvincies,
        city: selectedCities
      })
      if(response) {
        navigate('/')
      }
    } catch (error) {
      handleShowAlert(error.response.data.msg, false)
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

  return (
    <div className="register-container">
      <AlertComponent/>
      <div className="register-box-outer">
        <div className="register-box-inner-hero">
          <img src={loginHero} />
        </div>
        <div className="register-box-inner-form">
          <form onSubmit={Register}>
            <div className="register-title">
              <h1>
                Siapkan dirimu, <span>mulai jelajahi produk kekinian!</span>
              </h1>
            </div>
            <InputTextWithIcon
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
            <InputTextWithIcon
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
            <InputTextWithIcon
              args={{
                event: (e) => {
                  setConfPassword(e.target.value);
                },
                iconName: icon.cilLockLocked,
                placeholder: "Konfirmasi Password",
                width: "75%",
                type: "password",
              }}
            />
            <select
              name="provincies"
              id="provincies"
              className="selected"
              onChange={handleProvinciesOnChange}
            >
              <option value="">Pilih Provinsi</option>
              {listProvincies.map((value, index) => (
                <option key={index} value={value.id}>
                  {value.name}
                </option>
              ))}
            </select>
            {listCities.length > 0 && (
              <select
                name="cities"
                id="cities"
                className="selected"
                onChange={handleCitiesOnChange}
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {listCities.map((value, index) => (
                  <option key={index} value={value.id}>
                    {value.name}
                  </option>
                ))}
              </select>
            )}
            <button type="submit">DAFTAR</button>
            <div className="switch">
              <p style={{ color: "var(--primary-color)" }}>
                Sudah punya akun?{" "}
                <a href="/login" style={{ color: "var(--info-color)" }}>
                  Login
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

export default RegisterPage;
