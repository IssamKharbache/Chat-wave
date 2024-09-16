import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import EditProfileForm from "../EditProfileForm";

const page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  return <EditProfileForm session={session} />;
};

export default page;
