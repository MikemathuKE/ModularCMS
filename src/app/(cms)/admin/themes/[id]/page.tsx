"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { defaultTheme } from "@/theme/DefaultTheme";
import { renderJSONNode } from "@/renderer/JsonRenderer";
import { ThemeProvider } from "@/context/ThemeContext";

const TestPage = {
  component: "PageContainer",
  children: [
    {
      component: "Section",
      children: [
        {
          component: "Heading2",
          children: ["Hello from Preview"],
        },
        {
          component: "Paragraph",
          children: ["This is styled with the current theme."],
        },
      ],
    },
    {
      component: "Section",
      children: [
        {
          component: "Grid",
          children: [
            {
              component: "Card",
              children: [
                {
                  component: "ImageMedia",
                  props: {
                    src: "/images/underwater.jpg",
                    alt: "Card Image 1",
                    width: 800,
                    height: 200,
                  },
                },
                {
                  component: "CardContent",
                  children: [
                    {
                      component: "Paragraph",
                      children: [
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at sapien eu lorem bibendum congue.",
                      ],
                    },
                  ],
                },
                {
                  component: "CardFooter",
                  children: [
                    {
                      component: "Button",
                      children: ["Learn More"],
                    },
                  ],
                },
              ],
            },
            {
              component: "Card",
              children: [
                {
                  component: "CardHeader",
                  children: [
                    {
                      component: "Heading3",
                      children: ["Card Title 2"],
                    },
                  ],
                },
                {
                  component: "ImageMedia",
                  props: {
                    src: "/images/MyLogo.png",
                    alt: "Card Image 2",
                    width: 200,
                    height: 200,
                  },
                },
                {
                  component: "CardContent",
                  children: [
                    {
                      component: "Paragraph",
                      children: [
                        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
                      ],
                    },
                  ],
                },
                {
                  component: "CardFooter",
                  children: [
                    {
                      component: "Button",
                      children: ["Explore"],
                    },
                  ],
                },
              ],
            },
            {
              component: "Card",
              children: [
                {
                  component: "CardHeader",
                  children: [
                    {
                      component: "Heading3",
                      children: ["Card Title 3"],
                    },
                  ],
                },
                {
                  component: "CardContent",
                  children: [
                    {
                      component: "ImageMedia",
                      props: {
                        src: "/images/MyLogo.png",
                        alt: "Card Image 3",
                        width: 200,
                        height: 200,
                      },
                    },
                    {
                      component: "Paragraph",
                      children: [
                        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
                      ],
                    },
                  ],
                },
                {
                  component: "CardFooter",
                  children: [
                    {
                      component: "Button",
                      children: ["Read More"],
                    },
                  ],
                },
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
          component: "Section",
          children: [],
        },
        {
          component: "Table",
          props: {
            data: [
              {
                id: 1,
                name: "Alice Johnson",
                email: "alice@example.com",
                role: "Admin",
              },
              {
                id: 2,
                name: "Bob Smith",
                email: "bob@example.com",
                role: "User",
              },
              {
                id: 3,
                name: "Charlie Lee",
                email: "charlie@example.com",
                role: "Editor",
              },
              {
                id: 4,
                name: "Dana White",
                email: "dana@example.com",
                role: "User",
              },
              {
                id: 5,
                name: "Ethan Brown",
                email: "ethan@example.com",
                role: "Moderator",
              },
              {
                id: 6,
                name: "Fiona Black",
                email: "fiona@example.com",
                role: "User",
              },
              {
                id: 7,
                name: "George Young",
                email: "george@example.com",
                role: "Admin",
              },
            ],
            columns: [
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "role", label: "Role" },
            ],
          },
        },
      ],
    },
    {
      component: "Section",
      children: [
        {
          component: "Grid",
          children: [
            {
              component: "Card",
              children: [
                {
                  component: "CardHeader",
                  children: [
                    {
                      component: "Heading3",
                      children: ["Image Card"],
                    },
                  ],
                },
                {
                  component: "CardContent",
                  children: [
                    {
                      component: "ImageMedia",
                      props: {
                        src: "/images/MyLogo.png",
                        alt: "Beautiful Landscape",
                        width: 200,
                        height: 200,
                      },
                    },
                    {
                      component: "Paragraph",
                      children: [
                        "A stunning view of mountains and rivers. This image captures the beauty of nature.",
                      ],
                    },
                  ],
                },
                {
                  component: "CardFooter",
                  children: [
                    {
                      component: "Paragraph",
                      children: ["Uploaded on: July 20, 2025"],
                    },
                  ],
                },
              ],
            },
            {
              component: "Card",
              children: [
                {
                  component: "CardHeader",
                  children: [
                    {
                      component: "Heading3",
                      children: ["Audio Card"],
                    },
                  ],
                },
                {
                  component: "CardContent",
                  children: [
                    {
                      component: "AudioMedia",
                      props: {
                        src: "/audios/LogoIntro.mp3",
                        controls: true,
                      },
                    },
                    {
                      component: "Paragraph",
                      children: [
                        "Listen to this relaxing podcast episode about mindfulness and productivity.",
                      ],
                    },
                  ],
                },
                {
                  component: "CardFooter",
                  children: [
                    {
                      component: "Paragraph",
                      children: ["Duration: 18:32"],
                    },
                  ],
                },
              ],
            },
            {
              component: "Card",
              children: [
                {
                  component: "CardHeader",
                  children: [
                    {
                      component: "Heading3",
                      children: ["Video Card"],
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
                        controls: true,
                        width: 400,
                        height: 250,
                      },
                    },
                    {
                      component: "Paragraph",
                      children: [
                        "A tutorial on how to use the new CMS features. Covers layout editing and theming.",
                      ],
                    },
                  ],
                },
                {
                  component: "CardFooter",
                  children: [
                    {
                      component: "Paragraph",
                      children: ["Length: 4m 12s"],
                    },
                  ],
                },
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
          component: "Card",
          children: [
            {
              component: "Form",
              children: [
                {
                  component: "Heading3",
                  children: ["Contact Form"],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Name",
                  },
                  children: [
                    {
                      component: "TextInput",
                      props: {
                        name: "name",
                      },
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Email",
                  },
                  children: [
                    {
                      component: "EmailInput",
                      props: {
                        name: "name",
                      },
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Password",
                  },
                  children: [
                    {
                      component: "PasswordInput",
                      props: {
                        name: "password",
                      },
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Age",
                  },
                  children: [
                    {
                      component: "NumberInput",
                      props: {
                        name: "age",
                      },
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Date of Birth",
                  },
                  children: [
                    {
                      component: "DateInput",
                      props: {
                        name: "dob",
                      },
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Accept Terms",
                  },
                  children: [
                    {
                      component: "CheckboxInput",
                      props: {
                        name: "acceptTerms",
                      },
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Gender",
                  },
                  children: [
                    {
                      component: "RadioInput",
                      props: {
                        name: "gender",
                        value: "male",
                        style: {
                          flexDirection: "row",
                        },
                      },
                    },
                    "Male ",
                    {
                      component: "RadioInput",
                      props: {
                        name: "gender",
                        value: "female",
                        style: {
                          flexDirection: "row",
                        },
                      },
                    },
                    "Female ",
                  ],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Upload CV",
                  },
                  children: [
                    {
                      component: "FileInput",
                      props: {
                        name: "file",
                      },
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Volume",
                  },
                  children: [
                    {
                      component: "RangeInput",
                      props: {
                        name: "volume",
                        min: 0,
                        max: 100,
                        step: 1,
                      },
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Role",
                  },
                  children: [
                    {
                      component: "SelectInput",
                      props: {
                        name: "role",
                        min: 0,
                        max: 100,
                        step: 1,
                      },
                      children: [
                        {
                          component: "Option",
                          props: {
                            value: "",
                          },
                          children: ["--Select--"],
                        },
                        {
                          component: "Option",
                          props: {
                            value: "admin",
                          },
                          children: ["Admin"],
                        },
                        {
                          component: "Option",
                          props: {
                            value: "editor",
                          },
                          children: ["Editor"],
                        },
                        {
                          component: "Option",
                          props: {
                            value: "viewer",
                          },
                          children: ["Viewer"],
                        },
                      ],
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  props: {
                    label: "Feedback",
                  },
                  children: [
                    {
                      component: "TextArea",
                      props: {
                        name: "feedback",
                      },
                    },
                  ],
                },
                {
                  component: "FieldWrapper",
                  children: [
                    {
                      component: "Button",
                      props: {
                        type: "submit",
                      },
                      children: ["Submit"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default function ThemeEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [theme, setTheme] = useState<any>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [search, setSearch] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [themeUpdated, SetThemeUpdated] = useState(0);

  useEffect(() => {
    if (id !== "new") {
      fetch(`/api/cms/themes/manage?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTheme(data.json);
          setName(data.name);
          setSlug(data.slug);
        })
        .finally(() => setLoading(false));
    } else {
      setTheme(defaultTheme);
      setName("New Theme");
      setSlug(`theme-${Date.now()}`);
      setLoading(false);
    }
  }, [id]);

  function updateValue(path: string[], value: any) {
    setTheme((prev: any) => {
      const newTheme = structuredClone(prev);
      let obj = newTheme;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      SetThemeUpdated(themeUpdated + 1);
      return newTheme;
    });
  }

  function addField(path: string[], key: string, value: any) {
    setTheme((prev: any) => {
      const newTheme = structuredClone(prev);
      let obj = newTheme;
      for (let i = 0; i < path.length; i++) {
        obj = obj[path[i]];
      }
      obj[key] = value;
      return newTheme;
    });
  }

  function renderEditor(obj: any, path: string[] = []) {
    if (typeof obj !== "object" || obj === null) {
      return (
        <input
          type="text"
          value={obj ?? ""}
          onChange={(e) => updateValue(path, e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      );
    }

    return (
      <div className="ml-4 space-y-2">
        {Object.entries(obj)
          .filter(([key, val]) =>
            search &&
            key.toLowerCase() !== "componentstyles" &&
            typeof val === "object"
              ? key.toLowerCase().includes(search.toLowerCase())
              : true
          )
          .map(([key, val]) => (
            <div key={key} className="space-y-1">
              <label className="font-bold text-md text-gray-700">{key}</label>
              {renderEditor(val, [...path, key])}
            </div>
          ))}
        <div>
          <button
            type="button"
            onClick={() => {
              const newKey = prompt("Enter new property name:");
              if (newKey) addField(path, newKey, "");
            }}
            className="mt-2 text-sm text-blue-600 underline"
          >
            + Add Field
          </button>
        </div>
      </div>
    );
  }

  async function saveTheme() {
    const method = id === "new" ? "POST" : "PUT";
    const url =
      id === "new" ? "/api/cms/themes" : `/api/cms/themes/manage?id=${id}`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, json: theme }),
    });

    router.push("/admin/themes");
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(theme, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.json`;
    a.click();
  }

  function importJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        setTheme(data);
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between border-b p-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold">
          {id === "new" ? "Create New Theme" : `Edit Theme: ${name}`}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={saveTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
          <button
            onClick={exportJSON}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Export
          </button>
          <label className="px-4 py-2 bg-gray-200 rounded cursor-pointer">
            Import
            <input
              type="file"
              accept="application/json"
              onChange={importJSON}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Theme Editor */}
        <div className="w-1/2 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-4">
            <label className="block text-sm font-medium">Theme Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
          </div>

          <div className="space-y-2">{renderEditor(theme)}</div>
        </div>

        {/* Right: Live Preview */}
        {showPreview && (
          <div className="w-1/2 border-l overflow-y-auto bg-white p-6">
            <h2 className="text-lg font-bold mb-4">Live Preview</h2>
            <div className="border rounded p-4">
              <ThemeProvider themeIdentifier={theme} key={themeUpdated}>
                {" "}
                {renderJSONNode(TestPage)}{" "}
              </ThemeProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
