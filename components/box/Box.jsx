"use client";
import { theme } from "antd";

//token
const { useToken } = theme;

const Box = ({ children, type = "boxBg", style, ...other }) => {
  const { token } = useToken();
  return (
    <div
      {...other}
      style={{
        background: token[type],
        boxShadow: "box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.3)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Box;
