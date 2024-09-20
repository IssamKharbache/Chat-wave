export const sideBarLinks = (user) => [
  {
    name: "Home",
    href: "/",
    icon: "eva:home-fill",
  },
  {
    name: "Messages",
    href: "/messages",
    icon: "lucide:message-circle-more",
  },
  {
    name: "My profile",
    href: `/profile/${user?.id}`,
    icon: "bi:person-fill",
  },
];
