"use client";
import { useSession } from "next-auth/react";

const UserProfile = () => {
  const { data: session } = useSession();
  const image = session?.user?.image;
  const name = session?.user?.name;
  const email = session?.user?.email;
  return <div>{email}</div>;
};

export default UserProfile;
