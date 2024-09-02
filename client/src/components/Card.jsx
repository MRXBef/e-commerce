import React from "react";
import rupiahFormat from "../utils/rupiahFormat";
import avatar from "../assets/img/avatar.png";
import { useNavigate } from "react-router-dom";

const Card = ({ args }) => {
  const navigate = useNavigate()
  const productPrice = parseInt(args.productPrice.replace(/[^0-9]/g, ""));
  const productDiscount = parseFloat(args.productDiscount);

  return (
    <div
      // href={`/product/${args.productUuid}`}
      onClick={() => navigate(`/product/${args.productUuid}`)}
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        padding: "5px",
        position: "relative",
        cursor: 'pointer'
      }}
    >
      <img
        onClick={
          (e) => {
            e.stopPropagation()
            navigate(`/shop/${args.productOwner}`)
          }
        }
        src={args.productOwnerAvatar ?? avatar}
        style={{
          position: "absolute",
          top: "-10px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          objectFit: "cover",
          right: "-10px",
          border: "2px solid var(--secondary-color)",
          backgroundColor: "#fff",
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        }}
      />
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
              <p style={{ fontSize: "12px", textDecoration: "line-through" }}>
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
