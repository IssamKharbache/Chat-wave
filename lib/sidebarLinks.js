export const sideBarLinks = (user) => [
  {
    name: "Home",
    href: "/",
    icon: "eva:home-fill",
  },

  {
    name: "My profile",
    href: `/profile/${user?.id}`,
    icon: "bi:person-fill",
  },
];
