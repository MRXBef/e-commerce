import React, { useEffect, useState, useRef } from "react";
import "../css/components-css/Alert.css";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";

export const Alert = () => {
  const [alert, setAlert] = useState({
    status: false,
    message: "",
    isSuccess: false,
  });
  const timeoutRef = useRef(null);

  const handleShowAlert = (msg, isSuccess) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAlert((prevState) => ({
      ...prevState,
      message: msg,
      isSuccess,
      status: true,
    }));

    timeoutRef.current = setTimeout(() => {
      setAlert((prevState) => ({
        ...prevState,
        status: false,
      }));
      timeoutRef.current = null;
    }, 5000);
  };

  const AlertComponent = () => (
    <div className={`alert ${alert.status ? "" : "alert-hidden"}`}>
      <i
        style={{
          color: alert.isSuccess
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
        <CIcon icon={alert.isSuccess ? icon.cilCheckCircle : icon.cilXCircle} />
      </i>
      <h1
        style={{
          color: "#000",
          textAlign: "center",
          fontWeight: "500",
        }}
      >
        {alert.message}
      </h1>
    </div>
  );

  return {
    handleShowAlert,
    AlertComponent
  }
};

export const ConfirmAlert = () => {
  const [confirmAlert, setConfirmAlert] = useState({
    show: false,
    msg: "",
    confirm: null,
  });

  const handleButtonClicked = (e) => {
    const { name } = e.currentTarget;

    setConfirmAlert((prevState) => {
      const updatedState = { ...prevState, msg: "", show: false };

      // Panggil fungsi confirm dari state sebelumnya
      if (prevState.confirm) {
        prevState.confirm(name === "confirm");
      }

      return updatedState;
    });
  };

  const handleConfirmation = (msg) => {
    return new Promise((resolve) => {
      setConfirmAlert({
        show: true,
        msg: msg,
        confirm: (result) => resolve(result),
      });
    });
  };

  const ConfirmAlertComponent = () => (
    <div
      onClick={() =>
        setConfirmAlert((prevState) => ({ ...prevState, show: false }))
      }
      className={`confirm-alert-container ${
        confirmAlert.show ? "" : "confirm-alert-container-hidden"
      }`}
    >
      <div className="confirm-alert" onClick={(e) => e.stopPropagation()}>
        <i style={{ color: "var(--warning-color)" }}>
          <CIcon icon={icon.cilWarning} />
        </i>
        <h1>{confirmAlert.msg}</h1>
        <div>
          <button
            name="reject"
            onClick={handleButtonClicked}
            style={{ backgroundColor: "var(--danger-color)" }}
          >
            <i>
              <CIcon icon={icon.cilX} />
            </i>
          </button>
          <button
            name="confirm"
            onClick={handleButtonClicked}
            style={{ backgroundColor: "var(--success-color)" }}
          >
            <i>
              <CIcon icon={icon.cilCheck} />
            </i>
          </button>
        </div>
      </div>
    </div>
  );

  return {
    handleConfirmation,
    ConfirmAlertComponent,
  };
};
