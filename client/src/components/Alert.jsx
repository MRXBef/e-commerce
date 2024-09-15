import React, { useEffect, useState } from "react";
import "../css/components-css/Alert.css";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";

export const Alert = ({ args }) => {
  return (
    <div className={`alert ${args.status ? "" : "alert-hidden"}`}>
      <i
        style={{
          color: args.isSuccess
            ? "var(--success-color)"
            : "var(--danger-color)",
          position: "absolute",
          top: "-20px",
          padding: "5px",
          backgroundColor: "#fff",
          zIndex: "-1",
          borderRadius: "50%",
        }}
      >
        <CIcon icon={args.isSuccess ? icon.cilCheckCircle : icon.cilXCircle} />
      </i>
      <h1
        style={{
          color: "#000",
          textAlign: "center",
          fontWeight: "500",
        }}
      >
        {args.message}
      </h1>
    </div>
  );
};

export const ConfirmAlert = ({ args }) => {

  return (
    <div
      onClick={() => args.setConfirmAlert((prevState) => ({...prevState, show: false}))}
      className={`confirm-alert-container ${
        args.confirmAlert.show ? "" : "confirm-alert-container-hidden"
      }`}
    >
      <div className="confirm-alert" onClick={(e) => e.stopPropagation()}>
        <h1>{args.confirmAlert.msg}</h1>
        <div>
          <button name="reject" onClick={args.handleClickedConfirm} style={{backgroundColor: 'var(--danger-color)'}}>
            <i>
              <CIcon icon={icon.cilX}/>
            </i>
          </button>
          <button name="confirm" onClick={args.handleClickedConfirm} style={{backgroundColor: 'var(--success-color)'}}>
            <i>
              <CIcon icon={icon.cilCheck}/>
            </i>
          </button>
        </div>
      </div>
    </div>
  );
};
