// transitions.ts
export const TransitionPresets = {
  fadeIn: {
    label: "Fade In",
    style: {
      transition: "opacity 0.3s ease",
      opacity: 1,
    },
    initial: { opacity: 0 },
  },

  slideUp: {
    label: "Slide Up",
    style: {
      transition: "transform 0.3s ease, opacity 0.3s ease",
      transform: "translateY(0)",
      opacity: 1,
    },
    initial: { transform: "translateY(20px)", opacity: 0 },
  },

  slideRight: {
    label: "Slide Right",
    style: {
      transition: "transform 0.3s ease",
      transform: "translateX(0)",
    },
    initial: { transform: "translateX(-20px)" },
  },

  scalePop: {
    label: "Scale Pop",
    style: {
      transition: "transform 0.25s ease",
      transform: "scale(1)",
    },
    initial: { transform: "scale(0.9)" },
  },

  blurIn: {
    label: "Blur In",
    style: {
      transition: "opacity 0.3s ease, filter 0.3s ease",
      opacity: 1,
      filter: "blur(0)",
    },
    initial: { opacity: 0, filter: "blur(6px)" },
  },
} as const;

export type TransitionName = keyof typeof TransitionPresets;
