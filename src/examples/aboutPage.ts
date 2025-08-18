import { v4 as uuidv4 } from "uuid";

export const aboutPageJSON = {
  component: "",
  children: [
    {
      component: "Section",
      key: uuidv4(),
      children: [
        {
          component: "CardContent",
          children: [
            {
              component: "Heading2",
              children: ["About Us"],
            },
            {
              component: "Paragraph",
              children: [
                "This project is a demonstration of rendering styled components from a JSON configuration.",
              ],
            },
          ],
        },
      ],
    },
    {
      component: "Section",
      key: uuidv4(),
      children: [
        {
          component: "CardContent",
          children: [
            {
              component: "Heading4",
              children: ["Our Mission"],
            },
            {
              component: "Paragraph",
              children: [
                "To render highly customizable pages using JSON-driven UIs.",
              ],
            },
          ],
        },
      ],
    },
    {
      component: "Section",
      children: [
        {
          component: "CardHeader",
          children: [
            {
              component: "Heading4",
              children: ["Contact Us"],
            },
          ],
        },

        {
          component: "CardContent",
          children: [
            {
              component: "Form",
              children: [
                {
                  component: "FieldWrapper",
                  children: [
                    {
                      component: "Label",
                      props: { htmlFor: "email" },
                      children: ["Email"],
                    },
                    {
                      component: "EmailInput",
                      props: { name: "email" },
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  children: [
                    {
                      component: "Label",
                      props: { htmlFor: "message" },
                      children: ["Message"],
                    },
                    {
                      component: "TextArea",
                      props: { name: "message" },
                    },
                  ],
                },
                {
                  component: "Button",
                  props: { type: "submit" },
                  children: ["Send"],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
