import React, { useEffect, useState } from "react";
import { axiosInterceptors, decodeToken, refreshToken } from "../utils/tokenHandler";
import axios from "axios";
import PageLoader from "../components/PageLoader";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import '../css/pages-css/BuyNowPage.css'

const BuyNowPage = () => {
  //auth state
  const [authorized, setAuthorized] = useState(false);
  const [checkAuthorized, setCheckAuthorized] = useState(true);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);
  const [isPublicUser, setIsPublicUser] = useState(false)

  //this page state
  const [buyNowToken, setBuyNowToken] = useState("");
  const [buyNowExpire, setBuyNowExpire] = useState(0);
  // const [buyNowData, setBuyNowData] = useState({})
  const [checkBuyNowToken, setCheckBuyNowToken] = useState(true);

  const navigate = useNavigate();
  const axiosJWT = axiosInterceptors({token, setToken, expire, setExpire})

  useEffect(() => {
    refreshToken({ setAuthorized, setCheckAuthorized, setExpire, setToken, setIsPublicUser });

    if (authorized) {
      refreshBuyNowToken();
    } else if (!authorized && !checkAuthorized) {
      navigate("/login");
    }
  }, [authorized, checkAuthorized, navigate]);

  const refreshBuyNowToken = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/transaction/token`
      );
      setBuyNowToken(response.data.accessBuyNowToken);
      setCheckBuyNowToken(false);
    } catch (error) {
      if(error.response.status === 403 || error.response.status === 400) { 
        navigate(-1)
      }
      console.log(error.response);
    }
  };

  if (checkAuthorized || checkBuyNowToken) {
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

  console.log(decodeToken(buyNowToken))

  return (
    <div className="page-container">
      <Header
      args={{
        isAuthorized: authorized,
        token: decodeToken(token)
      }}
      />

      <div className="content-container">
        <div className="buynow-container">
          <div className="product-info-container">
            <h1>Beli Sekarang</h1>
          </div>
          <div className="product-price-container">
            <div className="cost-info">
              <h1 style={{color: '#000', fontWeight: '500'}}>Total Belanja</h1>
              <div className="const-info-field">
                <h1>Total Harga (12 Barang)</h1>
                <h1>Rp.12.000</h1>
              </div>
            </div>
            <div className="cost-info">
              <h1 style={{color: '#000', fontWeight: '500'}}>Biaya Transaksi</h1>
              <div className="const-info-field">
                <h1>Biaya Layanan</h1>
                <h1>Rp.1.000</h1>
              </div>
            </div>
            <div className="cost-info">
              <h1 style={{color: '#000', fontWeight: '500'}}>Biaya Pengiriman</h1>
              <div className="const-info-field">
                <h1>Total</h1>
                <h1>Rp.1.000</h1>
              </div>
            </div>
            <div className="total-payment">
              <h1>Total Tagihan</h1>
              <h1>Rp.300.000</h1>
            </div>
            <div className="bayar">
              <button>Bayar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default BuyNowPage;
