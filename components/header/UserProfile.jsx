import { getServerSession } from "next-auth";
import DropDown from "./DropDown";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const UserProfile = async () => {
  const session = await getServerSession(authOptions);
  const provider = session?.user?.provider;

  return (
    <div>
      <DropDown session={session} provider={provider} />
    </div>
  );
};

export default UserProfile;
