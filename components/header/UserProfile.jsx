"use client";
import { signOut, useSession } from "next-auth/react";

const UserProfile = () => {
  const session = useSession();
  console.log(session);
  return (
    <div>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default UserProfile;
