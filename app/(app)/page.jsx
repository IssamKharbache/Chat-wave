"use client";

import { useSession } from "next-auth/react";

const MainPage = () => {
  const session = useSession();
  console.log(session);

  return <h1>MAIN</h1>;
};

export default MainPage;
