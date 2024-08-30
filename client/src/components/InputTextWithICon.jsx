import React from "react";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";

const InputTextWithICon = ({ event, iconName, iconColor, placeholder, width }) => {
  return (
    <div
      className="input-container"
      style={{
        position: "relative",
        width: width,
        height: "40px",
      }}
    >
      <span className="iconku">
        <i
          style={{
            color: iconColor || "var(--secondary-color)",
            position: "absolute",
            left: "10px",
            top: "7px",
          }}
        >
          <CIcon icon={iconName} />
        </i>
      </span>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          width: "100%",
          height: "40px",
          paddingLeft: "40px",
          outline: "none",
          border: "1px solid var(--danger-color)",
          borderRadius: "10px",
        }}
        onChange={event}
      />
    </div>
  );
};

export default InputTextWithICon;
