import React, { useEffect } from "react";
import "../css/components-css/Alert.css";

export const Alert = ({ args }) => {
  return (
    <div className={`alert ${args.status ? "" : "alert-hidden"}`}>
      <h1
        style={{
          color: args.isSuccess
            ? "var(--success-color)"
            : "var(--danger-color)",
          textAlign: "center",
        }}
      >
        {args.message}
      </h1>
    </div>
  );
};
