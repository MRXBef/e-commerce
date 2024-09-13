import React from "react";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";

const InputTextWithIcon = ({ args }) => {
  //props [label, width, iconColor, iconName, placeholder, event]
  return (
    <div
      className="input-container"
      style={{
        display: "flex",
        flexDirection: "column",
        width: args.width,
        position: "relative",
      }}
    >
      {/* Label */}
      <label
        htmlFor={args.name}
        style={{
          marginBottom: "5px",
          fontSize: "14px",
        }}
      >
        {args.label}
      </label>

      <div style={{ position: "relative", width: "100%" }}>
        {/* Icon */}
        <span className="iconku">
          <i
            style={{
              color: args.iconColor || "var(--secondary-color)",
              position: "absolute",
              left: "10px",
              top: "10px",
            }}
          >
            <CIcon icon={args.iconName} />
          </i>
        </span>

        {/* Input */}
        <input
          id={args.name}
          name={args.name}
          type={args.type || 'text'}
          placeholder={args.placeholder}
          value={args.value}
          style={{
            width: "100%",
            height: "40px",
            paddingLeft: "40px",
            outline: "none",
            border: `1px solid ${args.borderColor || 'var(--primary-color)'}`,
            borderRadius: "10px",
          }}
          onChange={args.event}
        />
      </div>
    </div>
  );
};

export default InputTextWithIcon;
