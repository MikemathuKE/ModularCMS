// layoutPresets.ts

export const LayoutPresets = {
  row: {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  masonry: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
  },
} as const;

export type LayoutType = keyof typeof LayoutPresets;

// Define global breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};
