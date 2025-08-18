export const themeLayoutJSON = {
  component: "PageContainer",
  children: [
    {
      component: "Topbar",
      children: [
        {
          component: "Logo",
          props: {
            toggleSideBar: "SetShowSidebar",
            showSideBar: "showSidebar",
          },
          children: ["Logo"],
        },
        { component: "ExampleNavbar" },
      ],
    },
    {
      component: "Main",
      children: [
        {
          component: "Sidebar",
          props: {
            visibility: "sidebarVisibility",
            style: { height: "sidebarHeight" },
          },
          children: [
            {
              component: "SideNavigation",
              props: { title: "NavTitle", textColor: "white" },
              children: [
                {
                  component: "NavItem",
                  props: { href: "/home" },
                  children: ["Home"],
                },
                {
                  component: "NavItem",
                  props: { href: "/about" },
                  children: ["About"],
                },
              ],
            },
          ],
        },
        {
          component: "NavigationDrawer",
          props: {
            isOpen: "drawerOpen",
            toggleSidebar: "SetShowSidebar",
            position: "left",
          },
          children: [
            {
              component: "SideNavigation",
              props: { title: "NavTitle" },
              children: [
                {
                  component: "NavItem",
                  props: { href: "/home" },
                  children: ["Home"],
                },
                {
                  component: "NavItem",
                  props: { href: "/about" },
                  children: ["About"],
                },
                {
                  component: "NavItem",
                  props: { href: "/portfolio" },
                  children: ["Portfolio"],
                },
              ],
            },
          ],
        },
        {
          component: "Info",
          props: {
            style: { marginLeft: "computedMarginLeft" },
          },
          children: [{ component: "slot" }],
        },
      ],
    },
    {
      component: "Footer",
      children: [
        {
          component: "NavItem",
          props: { href: "https://github.com/MikemathuKE" },
          children: ["Github"],
        },
        {
          component: "NavItem",
          props: { href: "mailto:info@mikemathuke.com" },
          children: ["Email"],
        },
        {
          component: "NavItem",
          props: { href: "https://www.youtube.com/@MikemathuKE" },
          children: ["Youtube"],
        },
        {
          component: "NavItem",
          props: { href: "https://www.instagram.com/mikemathuke/" },
          children: ["Instagram"],
        },
        { component: "Span", children: ["© MikemathuKE"] },
      ],
    },
  ],
};
