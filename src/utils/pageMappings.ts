export const pageMappings = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: "FaHome",
    roles: ["admin", "editor", "superuser"],
  },
  {
    name: "Layout",
    path: "/admin/layout",
    icon: "FaObjectGroup",
    roles: ["admin", "editor", "superuser"],
  },
  {
    name: "Pages",
    path: "/admin/pages",
    icon: "FaFile",
    roles: ["admin", "editor", "superuser"],
  },
  {
    name: "Media",
    path: "/admin/media",
    icon: "FaCamera",
    roles: ["admin", "editor", "superuser"],
  },
  {
    name: "Content",
    path: "/admin/content",
    icon: "FaDatabase",
    roles: ["admin", "editor", "superuser"],
  },
  {
    name: "Content Types",
    path: "/admin/contenttypes",
    icon: "FaQuestionCircle",
    roles: ["admin", "editor", "superuser"],
  },
  {
    name: "Themes",
    path: "/admin/themes",
    icon: "FaPaintBrush",
    roles: ["admin", "editor", "superuser"],
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: "FaUsers",
    roles: ["admin", "superuser"],
  },
  {
    name: "Tenants",
    path: "/admin/tenants",
    icon: "FaServer",
    roles: ["admin", "superuser"],
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: "FaCog",
    roles: ["admin", "editor", "superuser"],
  },
];
