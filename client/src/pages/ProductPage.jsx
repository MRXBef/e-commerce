import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInterceptors, decodeToken, refreshToken } from "../utils/tokenHandler";
import PageLoader from "../components/PageLoader";
import Header from "../components/Header";
import axios from "axios";

const ProductPage = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);
  const [authorized, setAuthorized] = useState(false);
  const [checkAuthorized, setCheckAuthorized] = useState(true);
  const { product_uuid } = useParams();

  const axiosJWT = axiosInterceptors({ token, setToken, expire, setExpire });

  useEffect(() => {
    refreshToken({ setAuthorized, setCheckAuthorized, setToken, setExpire });
    fetchProductData()
    
  }, []);

  const fetchProductData = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASEURL}/product/${product_uuid}`)
      console.log(response)
    } catch (error) {
      console.log(error.response)
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

  return (
    <div className="page-container">
      <Header 
        args={{
          isAuthorized: authorized,
          token: decodeToken(token)
        }}
      />
      <div className="content-container">
        {product_uuid}
      </div>
    </div>
  );
};

export default ProductPage;

























// import React, { useState } from "react";

// const ProductPage = () => {
//   const itemColor = ["red", "green", "blue", "orange"];
//   const [colorIndex, setColorIndex] = useState(0);

//   const handleButtonClicked = (e) => {
//     const { name } = e.target;
//     if (
//       (colorIndex <= 0 && name === "left") ||
//       (colorIndex >= itemColor.length - 1 && name === "right")
//     )
//       return;
//     name === "right"
//       ? setColorIndex(colorIndex + 1)
//       : setColorIndex(colorIndex - 1);
//   };
//   return (
//     <div
//       style={{
//         width: "100%",
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         gap: "10px",
//       }}
//     >
//       <button
//         style={{ color: "black" }}
//         onClick={handleButtonClicked}
//         name="left"
//       >
//         Left
//       </button>
//       <div
//         style={{
//           width: "500px",
//           height: "500px",
//           backgroundColor: "black",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: itemColor[colorIndex],
//             width: "90%",
//             height: "90%",
//           }}
//         ></div>
//       </div>
//       <button
//         style={{ color: "black" }}
//         onClick={handleButtonClicked}
//         name="right"
//       >
//         Right
//       </button>
//     </div>
//   );
// };

// export default ProductPage;
