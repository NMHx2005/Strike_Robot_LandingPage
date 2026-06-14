export const SITE_NAME = "STRIKE ROBOT";
export const SITE_TAGLINE = "The 3D spatial creation platform for intelligent robots";
export const SITE_DESCRIPTION =
  "SR Platform generates physics-valid simulation environments, production-grade 3D assets, and training-ready datasets — from a single natural language description.";

export const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#features" },
  { label: "Case Studies", href: "#community", hasDropdown: true },
  { label: "Product", href: "#features", hasDropdown: true },
  { label: "Simulation", href: "#cta" },
];

export const NAV_CTA = "Create with SR Platform";

export const VIDEOS = {
  hero: "/Video/Comp%202.mp4",
  featureEditor: "/Video/Comp%201.mp4",
  communityExplore: "/Video/Comp%203.mp4",
  communityTutorials: "/Video/Comp%203.mp4",
} as const;

export const HERO_BACKGROUND = "/Background.png";

export const HERO = {
  badge1: { label: "3D Spatial Creation", color: "#317e6a" },
  badge2: { label: "Physical AI", color: "#69419d" },
  headlinePrefix: "The 3D spatial creation platform for ",
  headlineAccent: "intelligent robots",
  description:
    "SR Platform generates physics-valid simulation environments, production-grade 3D assets, and training-ready datasets — from a single natural language description",
  ctaPrimary: "Create with SR Platform",
  ctaSecondary: "Read about SR Platform",
};

export const FEATURES_SECTION = {
  headline: "Bring pixel world to reality",
  description:
    "Introducing SR Platform — our first-generation platform for building rich, persistent 3D spaces with high visual fidelity and spatial accuracy, designed for users to navigate, shape, and experience as their own.",
  cta: "Create with SR Platform",
};

// TODO: replace videoSrc per feature với asset đúng (hiện đang cycle qua 3 video có sẵn).
export const FEATURES = [
  {
    id: "asset-creation",
    title: "Asset Creation",
    description:
      "Generate custom 3D geometry from text, or photograph any real-world object to reconstruct it as a production-grade mesh with physically-based materials. Every asset is indexed into a shared library that improves every future scene.",
    boldPhrase: "custom 3D geometry",
    icon: "Box",
    videoSrc: "/Video/Comp%201.mp4",
  },
  {
    id: "spatial-layout",
    title: "Spatial Layout Generation",
    description:
      "Compose full simulation environments from natural language descriptions. SR Platform arranges objects, surfaces, and lighting with physics constraints baked in — ready for robot navigation tasks.",
    icon: "LayoutGrid",
    videoSrc: "/Video/Comp%202.mp4",
  },
  {
    id: "stimulation",
    title: "Simulation & Rollouts",
    description:
      "Run thousands of robot policy rollouts inside generated environments. Every simulation is instrumented with sensor outputs, collision data, and task success metrics exported automatically.",
    icon: "Car",
    videoSrc: "/Video/Comp%203.mp4",
  },
  {
    id: "realtime-edit",
    title: "Edit In Realtime",
    description:
      "Modify scenes on the fly — swap assets, adjust physics parameters, and regenerate lighting without leaving the platform. Changes propagate across all active simulation instances instantly.",
    icon: "PencilLine",
    videoSrc: "/Video/Comp%201.mp4",
  },
  {
    id: "export-pipeline",
    title: "Export to Training Pipeline",
    description:
      "Package simulation outputs as training-ready datasets in standard formats. SR Platform integrates directly with major robot learning frameworks including ROS2, IsaacGym, and MuJoCo.",
    icon: "Download",
    videoSrc: "/Video/Comp%202.mp4",
  },
];

export const SCROLLING_TEXT = {
  parts: ["Spatial", "Intelligence", "Platform"],
};

export const COMMUNITY = {
  explore: {
    tag: "#Explore",
    title: "Community Creations",
    description:
      "See what teams and researchers are building — simulation environments, training datasets, and robot tasks generated with SR Platform.",
    hoverLabel: "Explore Showcase",
  },
  tutorials: {
    tag: "#Learn",
    title: "Tutorials",
    description:
      "Step-by-step guides to generating your first environment, building custom assets, and exporting training datasets for your robot stack.",
    hoverLabel: "Watch Tutorial",
  },
};

export const VIDEO_CTA = {
  background: "/Vid.png",
  headlineLine1: "Build physical AI",
  headlineLine2: "with SR Platform.",
  cta: "Create with SR Platform",
};

export const FOOTER = {
  copyright:
    "© 2026 DSC Labs. All rights reserved. SR Platform™ is a trademark of DSC Labs.",
  socials: [
    { label: "X", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Discord", href: "#" },
  ],
};
