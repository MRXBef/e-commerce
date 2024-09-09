import React from "react";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";

const InputTextSearch = ({ args }) => {
  return (
    <div
      className="input-container"
      style={{
        position: "relative",
        width: args.width,
        height: "40px",
      }}
    >
      <span className="iconku">
            <button
            type="submit"
            style={{
                color: args.iconColor || "var(--secondary-color)",
                position: "absolute",
                right: "10px",
                top: "7px",
                outline: 'none'
            }}
            >
            <CIcon icon={args.iconName} />
            </button>

      </span>
      <input
        type="text"
        placeholder={args.placeholder}
        style={{
          width: "100%",
          height: "40px",
          paddingRight: "40px",
          paddingLeft: "10px",
          outline: "none",
          border: "1px solid grey",
          borderRadius: "10px",
        }}
        onChange={args.event}
      />
    </div>
  );
};

export default InputTextSearch;
