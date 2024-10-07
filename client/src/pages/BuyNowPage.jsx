import React, { useEffect, useState } from "react";
import { axiosInterceptors, decodeToken, refreshToken } from "../utils/tokenHandler";
import axios from "axios";
import PageLoader from "../components/PageLoader";
import { useNavigate } from "react-router-dom";

const BuyNowPage = () => {
  //auth state
  const [authorized, setAuthorized] = useState(false);
  const [checkAuthorized, setCheckAuthorized] = useState(true);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);
  const [isPublicUser, setIsPublicUser] = useState(false)

  //this page state
  const [buyNowData, setBuyNowData] = useState({});
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
      setBuyNowData(decodeToken(response.data.buyNowToken));
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

  console.log(buyNowData)

  return <div>BuyNowPage</div>;
};

export default BuyNowPage;
