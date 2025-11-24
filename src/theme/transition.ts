export const TransitionPresets = {
  // ---------- Basic Fades ----------
  fadeIn: {
    label: "Fade In",
    initial: { opacity: 0 },
    style: { opacity: 1, transition: "opacity 0.3s ease" },
  },
  fadeInSlow: {
    label: "Fade In (Slow)",
    initial: { opacity: 0 },
    style: { opacity: 1, transition: "opacity 0.8s ease" },
  },
  fadeInFast: {
    label: "Fade In (Fast)",
    initial: { opacity: 0 },
    style: { opacity: 1, transition: "opacity 0.15s ease" },
  },

  // ---------- Slide Up / Down / Left / Right ----------
  slideUp: {
    label: "Slide Up",
    initial: { opacity: 0, transform: "translateY(20px)" },
    style: {
      opacity: 1,
      transform: "translateY(0)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },
  slideDown: {
    label: "Slide Down",
    initial: { opacity: 0, transform: "translateY(-20px)" },
    style: {
      opacity: 1,
      transform: "translateY(0)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },
  slideLeft: {
    label: "Slide Left",
    initial: { opacity: 0, transform: "translateX(20px)" },
    style: {
      opacity: 1,
      transform: "translateX(0)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },
  slideRight: {
    label: "Slide Right",
    initial: { opacity: 0, transform: "translateX(-20px)" },
    style: {
      opacity: 1,
      transform: "translateX(0)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },

  // ---------- Slide + Fade Combos ----------
  slideFadeUp: {
    label: "Slide + Fade Up",
    initial: { opacity: 0, transform: "translateY(30px)" },
    style: {
      opacity: 1,
      transform: "translateY(0)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    },
  },
  slideFadeDown: {
    label: "Slide + Fade Down",
    initial: { opacity: 0, transform: "translateY(-30px)" },
    style: {
      opacity: 1,
      transform: "translateY(0)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    },
  },

  // ---------- Scale / Zoom ----------
  scalePop: {
    label: "Scale Pop",
    initial: { transform: "scale(0.9)", opacity: 0 },
    style: {
      transform: "scale(1)",
      opacity: 1,
      transition: "transform 0.25s ease, opacity 0.25s ease",
    },
  },
  zoomIn: {
    label: "Zoom In",
    initial: { transform: "scale(0.8)", opacity: 0 },
    style: {
      transform: "scale(1)",
      opacity: 1,
      transition: "transform 0.35s ease, opacity 0.35s ease",
    },
  },
  zoomOut: {
    label: "Zoom Out",
    initial: { transform: "scale(1.2)", opacity: 0 },
    style: {
      transform: "scale(1)",
      opacity: 1,
      transition: "transform 0.35s ease, opacity 0.35s ease",
    },
  },

  // ---------- Rotate ----------
  rotateIn: {
    label: "Rotate In",
    initial: { transform: "rotate(-10deg)", opacity: 0 },
    style: {
      transform: "rotate(0deg)",
      opacity: 1,
      transition: "transform 0.35s ease, opacity 0.35s ease",
    },
  },
  rotateInLeft: {
    label: "Rotate In Left",
    initial: { transform: "rotate(-25deg)", opacity: 0 },
    style: {
      transform: "rotate(0)",
      opacity: 1,
      transition: "all 0.4s ease",
    },
  },
  rotateInRight: {
    label: "Rotate In Right",
    initial: { transform: "rotate(25deg)", opacity: 0 },
    style: {
      transform: "rotate(0)",
      opacity: 1,
      transition: "all 0.4s ease",
    },
  },

  // ---------- Blur ----------
  blurIn: {
    label: "Blur In",
    initial: { opacity: 0, filter: "blur(6px)" },
    style: {
      opacity: 1,
      filter: "blur(0)",
      transition: "opacity 0.4s ease, filter 0.4s ease",
    },
  },

  blurFadeIn: {
    label: "Blur Fade In",
    initial: { opacity: 0, filter: "blur(12px)" },
    style: {
      opacity: 1,
      filter: "blur(0)",
      transition: "opacity 0.5s ease, filter 0.5s ease",
    },
  },

  // ---------- Elastic / Bounce ----------
  bounceIn: {
    label: "Bounce In",
    initial: { transform: "scale(0.7)", opacity: 0 },
    style: {
      transform: "scale(1)",
      opacity: 1,
      transition:
        "transform 0.5s cubic-bezier(.34,1.56,.64,1), opacity 0.3s ease",
    },
  },
  elasticUp: {
    label: "Elastic Up",
    initial: { transform: "translateY(40px)", opacity: 0 },
    style: {
      transform: "translateY(0)",
      opacity: 1,
      transition:
        "transform 0.6s cubic-bezier(.34,1.56,.64,1), opacity 0.4s ease",
    },
  },

  // ---------- Flip ----------
  flipX: {
    label: "Flip X Axis",
    initial: { transform: "rotateX(90deg)", opacity: 0 },
    style: {
      transform: "rotateX(0)",
      opacity: 1,
      transition: "all 0.5s ease",
    },
  },
  flipY: {
    label: "Flip Y Axis",
    initial: { transform: "rotateY(90deg)", opacity: 0 },
    style: {
      transform: "rotateY(0)",
      opacity: 1,
      transition: "all 0.5s ease",
    },
  },

  // ---------- Width / Height reveal ----------
  revealHeight: {
    label: "Reveal Height",
    initial: { height: "0px", overflow: "hidden" },
    style: {
      height: "auto",
      overflow: "hidden",
      transition: "height 0.4s ease",
    },
  },
  revealWidth: {
    label: "Reveal Width",
    initial: { width: "0px", overflow: "hidden" },
    style: {
      width: "auto",
      overflow: "hidden",
      transition: "width 0.4s ease",
    },
  },

  // ---------- Ken Burns (subtle zoom shift) ----------
  kenBurns: {
    label: "Ken Burns",
    initial: { transform: "scale(1.05)", opacity: 0 },
    style: {
      transform: "scale(1)",
      opacity: 1,
      transition: "transform 1.2s ease, opacity 0.5s ease",
    },
  },

  // ---------- Drop / Lift ----------
  dropIn: {
    label: "Drop In",
    initial: { transform: "translateY(-50px)", opacity: 0 },
    style: {
      transform: "translateY(0)",
      opacity: 1,
      transition: "transform 0.4s ease-out, opacity 0.3s ease-out",
    },
  },
  liftIn: {
    label: "Lift In",
    initial: { transform: "translateY(50px)", opacity: 0 },
    style: {
      transform: "translateY(0)",
      opacity: 1,
      transition: "transform 0.4s ease-out, opacity 0.3s ease-out",
    },
  },

  // ---------- Stagger-friendly fade ----------
  softAppear: {
    label: "Soft Appear",
    initial: { opacity: 0, transform: "translateY(10px)" },
    style: {
      opacity: 1,
      transform: "translateY(0)",
      transition: "opacity 0.25s ease, transform 0.25s ease",
    },
  },

  // ---------- Opacity Pulse ----------
  pulseIn: {
    label: "Pulse In",
    initial: { opacity: 0.2, transform: "scale(0.95)" },
    style: {
      opacity: 1,
      transform: "scale(1)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },

  // ---------- Fade Out ----------
  fadeOut: {
    label: "Fade Out",
    initial: {},
    style: { opacity: 0, transition: "opacity 0.3s ease" },
  },
  fadeOutFast: {
    label: "Fade Out (Fast)",
    initial: {},
    style: { opacity: 0, transition: "opacity 0.15s ease" },
  },
  fadeOutSlow: {
    label: "Fade Out (Slow)",
    initial: {},
    style: { opacity: 0, transition: "opacity 0.8s ease" },
  },

  // ---------- Slide Out ----------
  slideUpOut: {
    label: "Slide Up Out",
    initial: {},
    style: {
      opacity: 0,
      transform: "translateY(-20px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },
  slideDownOut: {
    label: "Slide Down Out",
    initial: {},
    style: {
      opacity: 0,
      transform: "translateY(20px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },
  slideLeftOut: {
    label: "Slide Left Out",
    initial: {},
    style: {
      opacity: 0,
      transform: "translateX(-20px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },
  slideRightOut: {
    label: "Slide Right Out",
    initial: {},
    style: {
      opacity: 0,
      transform: "translateX(20px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },

  // ---------- Slide + Fade Out ----------
  slideFadeUpOut: {
    label: "Slide + Fade Up Out",
    initial: {},
    style: {
      opacity: 0,
      transform: "translateY(-30px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    },
  },
  slideFadeDownOut: {
    label: "Slide + Fade Down Out",
    initial: {},
    style: {
      opacity: 0,
      transform: "translateY(30px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    },
  },

  // ---------- Scale / Zoom ----------
  scaleOut: {
    label: "Scale Out",
    initial: {},
    style: {
      transform: "scale(0.9)",
      opacity: 0,
      transition: "transform 0.25s ease, opacity 0.25s ease",
    },
  },
  zoomOutFar: {
    label: "Zoom Out Far",
    initial: {},
    style: {
      transform: "scale(0.6)",
      opacity: 0,
      transition: "transform 0.45s ease, opacity 0.35s ease",
    },
  },

  // ---------- Rotation ----------
  rotateOut: {
    label: "Rotate Out",
    initial: {},
    style: {
      transform: "rotate(10deg)",
      opacity: 0,
      transition: "transform 0.35s ease, opacity 0.35s ease",
    },
  },
  rotateOutLeft: {
    label: "Rotate Out Left",
    initial: {},
    style: {
      transform: "rotate(-25deg)",
      opacity: 0,
      transition: "all 0.4s ease",
    },
  },
  rotateOutRight: {
    label: "Rotate Out Right",
    initial: {},
    style: {
      transform: "rotate(25deg)",
      opacity: 0,
      transition: "all 0.4s ease",
    },
  },

  // ---------- Blur Out ----------
  blurOut: {
    label: "Blur Out",
    initial: {},
    style: {
      opacity: 0,
      filter: "blur(6px)",
      transition: "opacity 0.4s ease, filter 0.4s ease",
    },
  },
  blurFadeOut: {
    label: "Blur Fade Out",
    initial: {},
    style: {
      opacity: 0,
      filter: "blur(12px)",
      transition: "opacity 0.5s ease, filter 0.5s ease",
    },
  },

  // ---------- Bounce / Elastic Exit ----------
  bounceOut: {
    label: "Bounce Out",
    initial: {},
    style: {
      transform: "scale(0.7)",
      opacity: 0,
      transition:
        "transform 0.45s cubic-bezier(.34,1.56,.64,1), opacity 0.3s ease",
    },
  },
  elasticDownOut: {
    label: "Elastic Down Out",
    initial: {},
    style: {
      transform: "translateY(40px)",
      opacity: 0,
      transition:
        "transform 0.6s cubic-bezier(.34,1.56,.64,1), opacity 0.4s ease",
    },
  },

  // ---------- Flip Out ----------
  flipXOut: {
    label: "Flip X Out",
    initial: {},
    style: {
      transform: "rotateX(90deg)",
      opacity: 0,
      transition: "all 0.5s ease",
    },
  },
  flipYOut: {
    label: "Flip Y Out",
    initial: {},
    style: {
      transform: "rotateY(90deg)",
      opacity: 0,
      transition: "all 0.5s ease",
    },
  },

  // ---------- Reveal Collapses ----------
  collapseHeight: {
    label: "Collapse Height",
    initial: { height: "auto", overflow: "hidden" },
    style: {
      height: "0px",
      overflow: "hidden",
      transition: "height 0.4s ease",
    },
  },
  collapseWidth: {
    label: "Collapse Width",
    initial: { width: "auto", overflow: "hidden" },
    style: {
      width: "0px",
      overflow: "hidden",
      transition: "width 0.4s ease",
    },
  },

  // ---------- Ken Burns Out ----------
  kenBurnsOut: {
    label: "Ken Burns Out",
    initial: {},
    style: {
      transform: "scale(1.05)",
      opacity: 0,
      transition: "transform 1.2s ease, opacity 0.5s ease",
    },
  },

  // ---------- Drop / Lift ----------
  dropOut: {
    label: "Drop Out",
    initial: {},
    style: {
      transform: "translateY(-50px)",
      opacity: 0,
      transition: "transform 0.4s ease-out, opacity 0.3s ease-out",
    },
  },
  liftOut: {
    label: "Lift Out",
    initial: {},
    style: {
      transform: "translateY(50px)",
      opacity: 0,
      transition: "transform 0.4s ease-out, opacity 0.3s ease-out",
    },
  },

  // ---------- Soft Fade ----------
  softFadeOut: {
    label: "Soft Fade Out",
    initial: {},
    style: {
      opacity: 0,
      transform: "translateY(10px)",
      transition: "opacity 0.25s ease, transform 0.25s ease",
    },
  },

  // ---------- Pulse Out ----------
  pulseOut: {
    label: "Pulse Out",
    initial: {},
    style: {
      opacity: 0.2,
      transform: "scale(0.95)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },
} as const;

export type TransitionName = keyof typeof TransitionPresets;
