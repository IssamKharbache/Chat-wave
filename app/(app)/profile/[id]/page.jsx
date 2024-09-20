import ProfileView from "@/sections/profile/ProfileView";

export const generateMetadata = (params) => {
  return {
    title: `${params?.searchParams?.person} | Profile`,
    description: `Profile of user ${params?.params?.id}`,
  };
};

const ProfilePage = (params) => {
  return <ProfileView userId={params?.params?.id} />;
};

export default ProfilePage;
