export const NAV_ITEMS = [
  { path: "/", label: "Home", roles: ["CUSTOMER", "SELLER", "ADMIN"] },
  {
    path: "/profile",
    label: "Profile",
    roles: ["CUSTOMER", "SELLER", "ADMIN"],
  },
  { path: "/", label: "Add", roles: ["SELLER"] },
  { path: "/", label: "Orders", roles: ["SELLER"] },
  { path: "/", label: "Sellers", roles: ["ADMIN"] },
  { path: "/", label: "About", roles: ["CUSTOMER", "SELLER", "ADMIN"] },
];
