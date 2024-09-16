import SignOutBtn from "@/components/global/SignOutBtn";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <h1>Hello : {session?.user?.email}</h1>
      <SignOutBtn />
    </main>
  );
}
