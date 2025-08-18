import { v4 as uuidv4 } from "uuid";

export const homePageJSON = {
  component: "",
  children: [
    // --- Hero Section ---
    {
      component: "Section",
      key: uuidv4(),
      props: { style: { textAlign: "center", marginBottom: "2rem" } },
      children: [
        {
          component: "CardHeader",
          children: [
            {
              component: "Heading2",
              children: ["Welcome to Our Platform"],
            },
          ],
        },
        {
          component: "CardContent",
          children: [
            {
              component: "Paragraph",
              children: [
                "Crafting dynamic UIs using JSON-driven styled components in Next.js.",
              ],
            },
            {
              component: "ImageMedia",
              props: {
                src: "/images/underwater.jpg",
                alt: "Hero",
                width: 600,
                height: 300,
              },
            },
          ],
        },
      ],
    },

    // --- Intro Video Section ---
    {
      component: "Section",
      key: uuidv4(),
      props: { style: { marginBottom: "2rem" } },
      children: [
        {
          component: "CardHeader",
          children: [
            {
              component: "Heading4",
              children: ["Intro Video"],
            },
          ],
        },
        {
          component: "CardContent",
          children: [
            {
              component: "VideoMedia",
              props: {
                src: "/videos/Logo reveal.mp4",
                width: 600,
                height: 340,
                controls: true,
              },
            },
          ],
        },
      ],
    },

    // --- Call To Action ---
    {
      component: "Section",
      key: uuidv4(),
      children: [
        {
          component: "CardContent",
          children: [
            {
              component: "Heading4",
              children: ["Get Started"],
            },
            {
              component: "Paragraph",
              children: [
                "Explore how easy it is to build pages like this with JSON.",
              ],
            },
            {
              component: "Button",
              props: { type: "button", style: { marginTop: "1rem" } },
              children: ["Learn More"],
            },
          ],
        },
      ],
    },

    // --- Features Grid Section ---
    {
      component: "Section",
      key: uuidv4(),
      props: {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginTop: "2rem",
        },
      },
      children: [
        {
          component: "Card",
          children: [
            {
              component: "ImageMedia",
              props: {
                src: "/images/MyLogo.png",
                alt: "Fast",
                width: 300,
                height: 200,
              },
            },
            {
              component: "Heading4",
              children: ["Fast"],
            },
            {
              component: "Paragraph",
              children: ["Quickly build interfaces with JSON."],
            },
          ],
        },
        {
          component: "Card",
          children: [
            {
              component: "ImageMedia",
              props: {
                src: "/images/MyLogo.png",
                alt: "Flexible",
                width: 300,
                height: 200,
              },
            },
            {
              component: "Heading4",
              children: ["Flexible"],
            },
            {
              component: "Paragraph",
              children: ["Extend components easily across pages."],
            },
          ],
        },
        {
          component: "Card",
          children: [
            {
              component: "ImageMedia",
              props: {
                src: "/images/MyLogo.png",
                alt: "Reusable",
                width: 300,
                height: 200,
              },
            },
            {
              component: "Heading4",
              children: ["Reusable"],
            },
            {
              component: "Paragraph",
              children: ["Drive entire layouts consistently with JSON."],
            },
          ],
        },
      ],
    },
  ],
};
