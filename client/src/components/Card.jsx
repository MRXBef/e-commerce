import React, { useState, useEffect, useRef } from "react";
import rupiahFormat from "../utils/rupiahFormat";
import avatar from "../assets/img/avatar.png";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";

const Card = ({ args }) => {
  const navigate = useNavigate();
  const productPrice = parseInt(args.productPrice.replace(/[^0-9]/g, ""));
  const productDiscount = parseFloat(args.productDiscount);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 767);
  const [isOptionVisible, setIsOptionVisible] = useState(false);
  const boxRef = useRef(null);

  const handleClickOutside = (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setIsOptionVisible(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      onClick={() => navigate(`/product/${args.productUuid}`)}
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        padding: "5px",
        position: "relative",
        cursor: "pointer",
        width: "100%",
        maxWidth: isMobile
          ? args.totalOfProduct <= 1
            ? "100%" // Mobile dengan total produk <= 1
            : "250px" // Mobile dengan total produk > 1
          : args.totalOfProduct <= 1
          ? "250px" // Desktop dengan total produk <= 1
          : "100%", // Desktop dengan total produk > 1
      }}
    >
      {args.isOwnProduct ? (
        <i
          style={{
            position: "absolute",
            top: 0,
            right: "-10px",
            display: "flex",
            justifyContent: "center",
            padding: "5px",
            background: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8))",
            borderRadius: "50%",
            color: "#fff",
            cursor: "pointer",
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOptionVisible(!isOptionVisible);
          }}
        >
          {isOptionVisible && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100px",
                background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8))',
                position: "absolute",
                borderRadius: "10px 0px 10px 10px",
                left: "-101px",
                top: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
                padding: "10px 0px 10px 0px",
                cursor: 'auto'
              }}
            >
              <h1
                style={{
                  color: "#fff",
                  fontStyle: "normal",
                  fontWeight: "500",
                  fontSize: "15px",
                  cursor: 'pointer'
                }}
              >
                Ubah
              </h1>
              <h1
                onClick={args.deleteProduct}
                style={{
                  color: "var(--danger-color)",
                  fontStyle: "normal",
                  fontWeight: "500",
                  fontSize: "15px",
                  cursor: 'pointer'
                }}
              >
                Hapus
              </h1>
            </div>
          )}
          <CIcon icon={icon.cilOptions} />
        </i>
      ) : (
        <img
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/shop/${args.productOwner}`);
          }}
          src={
            args.ownerAvatar !==
            `${import.meta.env.VITE_BASEURL}/user/avatar/null`
              ? args.ownerAvatar
              : avatar
          }
          style={{
            position: "absolute",
            top: "-10px",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            objectFit: "cover",
            right: "-10px",
            border: "2px solid var(--secondary-color)",
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          }}
        />
      )}
      <img
        src={args.productThumbnail}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "100%",
            color: "black",
          }}
        >
          {args.productTitle}
        </h1>
      </div>
      <div
        style={{
          width: "100%",
          height: "50px",
          marginTop: "10px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {productDiscount > 0 ? (
            <>
              <h1 style={{ color: "var(--primary-color)", fontWeight: "bold" }}>
                {rupiahFormat(productPrice - productPrice * productDiscount)}
              </h1>
              <p style={{ fontSize: "12px", color: "var(--secondary-color)", fontWeight: '500', textDecoration: "line-through" }}>
                {rupiahFormat(productPrice)}
              </p>
            </>
          ) : (
            <>
              <h1 style={{ color: "var(--primary-color)", fontWeight: "bold" }}>
                {rupiahFormat(productPrice - productPrice * productDiscount)}
              </h1>
              <p
                style={{ fontSize: "12px", textDecoration: "line-through" }}
              ></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
