import loader from '../assets/svg/loader.svg'
import React from "react";

const PageLoader = () => {
  return (
    <div>
      <img
        src={loader}
        style={{
          width: "50px",
          height: "50px",
        }}
      />
    </div>
  );
};

export default PageLoader;
