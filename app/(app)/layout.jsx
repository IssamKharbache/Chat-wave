import React from "react";

const HomeLayout = ({ children }) => {
  return (
    <ContextProvider>
      <div>{children}</div>;
    </ContextProvider>
  );
};

export default HomeLayout;
