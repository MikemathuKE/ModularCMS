import { v4 as uuidv4 } from "uuid";

export const portfolioPageJSON = {
  component: "",
  children: [
    {
      component: "Section",
      key: uuidv4(),
      children: [
        { component: "Heading2", children: ["Our Work"] },
        {
          component: "Paragraph",

          children: [
            "Some of the projects we've created using dynamic JSON layouts.",
          ],
        },
      ],
    },
    {
      component: "Grid",
      key: uuidv4(),
      children: [
        {
          component: "Card",

          children: [
            {
              component: "CardContent",

              children: [
                {
                  component: "ImageMedia",

                  props: {
                    src: "/images/bubblesAndFlowers.jpg",
                    alt: "Project 1",
                    width: 600,
                    height: 200,
                  },
                },
                {
                  component: "Heading4",

                  children: ["Project One"],
                },
                {
                  component: "Paragraph",

                  children: ["JSON powered website"],
                },
              ],
            },
            {
              component: "CardFooter",

              children: [
                {
                  component: "Button",

                  props: { type: "button" },
                  children: ["View"],
                },
              ],
            },
          ],
        },
        {
          component: "Card",

          children: [
            {
              component: "CardContent",

              children: [
                {
                  component: "ImageMedia",

                  props: {
                    src: "/images/MyLogo.png",
                    alt: "Project 2",
                    width: 600,
                    height: 200,
                  },
                },
                {
                  component: "Heading4",

                  children: ["Project Two"],
                },
                {
                  component: "Paragraph",

                  children: ["Dynamic internal dashboard"],
                },
              ],
            },
            {
              component: "CardFooter",

              children: [
                {
                  component: "Button",

                  props: { type: "button" },
                  children: ["View"],
                },
              ],
            },
          ],
        },
        {
          component: "Card",

          children: [
            {
              component: "CardContent",

              children: [
                {
                  component: "ImageMedia",

                  props: {
                    src: "/images/underwater.jpg",
                    alt: "Project 3",
                    width: 600,
                    height: 200,
                  },
                },
                {
                  component: "Heading4",

                  children: ["Project Three"],
                },
                {
                  component: "Paragraph",

                  children: ["Custom admin CMS"],
                },
              ],
            },
            {
              component: "CardFooter",

              children: [
                {
                  component: "Button",

                  props: { type: "button" },
                  children: ["View"],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
