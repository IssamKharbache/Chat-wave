import React from "react";
import { PulseLoader } from "react-spinners";

const Loader = ({ size, color }) => {
  return (
    <PulseLoader
      size={size ? size : 12}
      color={color ? color : "#fff"}
      loading
      speedMultiplier={0.5}
    />
  );
};

export default Loader;
