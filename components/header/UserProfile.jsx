import { getServerSession } from "next-auth";
import DropDown from "./DropDown";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const UserProfile = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <DropDown session={session} />
    </div>
  );
};

export default UserProfile;
