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
  subtitle: "Build physical AI with",
  wordmark: "SR PLATFORM",
  cta: "Create with SR Platform",
  rotatingBadge: "STRIKE ROBOT • STRIKE ROBOT • STRIKE ROBOT • STRIKE ROBOT • ",
  sidebarLinks: [
    { label: "About", href: "#" },
    { label: "Search & Insights", href: "#" },
    { label: "Strike Robot Labs", href: "#" },
    { label: "About", href: "#" },
    { label: "Term of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Security", href: "#" },
  ],
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

// ---------------- AGENTIC PAGE (/agentic) ----------------

export const AGENTIC_HERO = {
  wordmark: "SR\nAGENTIC",
  badge: "Task-Conditioned Scene Graph Navigation",
  headlinePrefix: "Ephemeral intelligence for robots that ",
  headlineAccent: "act in the real world.",
  description:
    "SR Agentic builds task-shaped spatial understanding on the fly — and adapts the instant the world changes. No universal map to maintain, no stale world model to fight.",
  ctaPrimary: "Build with Agentic",
  ctaSecondary: "Read about proposal",
  videoCaption:
    "A short look at how SR Agentic turns a natural-language task into a lean, task-shaped world model — running a fast safety loop on the robot and deep reasoning in the cloud.",
};

export const AGENTIC_LAYER_SECTION = {
  headline: "One intelligence layer, four working parts.",
  description:
    "SR Agentic sits between perception and action — it decides what to understand, builds only that, verifies before it commits, and keeps the robot safe throughout.",
};

export const AGENTIC_PARTS = [
  {
    id: "tcsg",
    title: "Task-Conditioned Scene Graph",
    description:
      "Builds a Task-Conditioned Scene Graph (TC-SG) — picking or synthesizing the right spatial ontology before it maps. The map is a function of the task, not a fixed universal schema.",
    media: "/agentic/parts/tcsg.png",
  },
  {
    id: "open-vocab",
    title: "Open-vocabulary perception",
    description:
      "Detects and grounds objects it was never explicitly trained on, fusing detection, segmentation, and captioning into the live scene understanding.",
    media: "/agentic/parts/open-vocab.png",
  },
  {
    id: "realtime",
    title: "Real-time adaptation",
    description:
      "Change detection updates the world model as the environment shifts; the planner re-plans on the fly instead of acting on a stale snapshot.",
    media: "/agentic/parts/realtime.png",
  },
  {
    id: "trust",
    title: "Trust & anti-hallucination",
    description:
      "Confidence gating, grounded retrieval, and visual verification mean the robot abstains and re-checks rather than acting on a confident guess.",
    media: "/agentic/parts/trust.png",
  },
];

export const AGENTIC_LOOP = {
  headlineLine1: "A fast loop on the robot",
  headlineLine2: "A deep loop in the cloud",
  description:
    "A lightweight safety loop runs continuously on the edge — the robot stays safe and moving even if the cloud link drops. Heavy multimodal reasoning runs only when something new happens, which is what makes foundation-model intelligence affordable at fleet scale.",
  edge: {
    label: "EDGE",
    subtitle: "on the robot",
    timing: "Fast loop • Always on",
    cadence: "Continuous, low-latency",
    nodes: [
      { title: "Sensors + local SLAM", subtitle: "RGB-D • LiDAR • pose" },
      { title: "Obstacle avoidance", subtitle: "Real-time adaptation" },
      { title: "Safety governor", subtitle: "Allow-list • e-stop • waypoints" },
    ],
  },
  cloud: {
    label: "CLOUD",
    subtitle: "GPU Cluster",
    timing: "Deep loop • Event-triggered",
    cadence: "Triggered by new events",
    nodes: [
      { title: "Open-vocab perception", subtitle: "Detect · segment · caption" },
      { title: "Build TC-SG", subtitle: "Task-Conditioned Scene Graph" },
      { title: "Reasoning + planner", subtitle: "Subgoals · verify · abstain" },
    ],
  },
};

export const AGENTIC_AWARENESS = {
  tag: "ACROSS ROBOTS AND MISSIONS",
  headline: "One awareness engine. Re-shaped for every deployment.",
  description:
    "The same intelligence layer adapts to each robot and each task through reusable schema templates — so every deployment gets focused, accurate navigation, not a bloated general-purpose map.",
  slides: [
    {
      id: "security-patrol",
      title: "Autonomous security patrol",
      description:
        "Routine patrols of warehouses, substations, and construction sites. The robot maps only persistent infrastructure, flags anomalies, and adapts to what's changed since the last sweep.",
      videoSrc: "/Video/Comp%201.mp4",
    },
    {
      id: "factory-inspection",
      title: "Factory floor inspection",
      description:
        "Walk production lines with task-conditioned attention on equipment, conveyors, and operators. Detect deviations from baseline and surface only what needs a human decision.",
      videoSrc: "/Video/Comp%202.mp4",
    },
    {
      id: "search-rescue",
      title: "Search and rescue",
      description:
        "Indoor search-and-rescue across unfamiliar buildings — schema templates focus on victims, exits, and hazards instead of trying to map the entire structure to centimeter accuracy.",
      videoSrc: "/Video/Comp%203.mp4",
    },
  ],
};

export const AGENTIC_OEMS = {
  tag: "DEVELOP WITH SR AGENTIC",
  headlinePart1: "Built for robotics teams ",
  headlinePart2: "and hardware",
  headlineAccent: "oems",
  description:
    "Integrate the awareness layer and keep your own action policies closed. SR Agentic gives you deployable navigation intelligence without rebuilding spatial reasoning for every new environment.",
  bullets: [
    {
      title: "Open-vocabulary perception",
      description:
        "Detects and grounds objects it was never explicitly trained on, fusing detection, segmentation, and captioning into the live scene understanding.",
      icon: "/agentic/oems/perception.png",
    },
    {
      title: "Deploy across domains with reusable schema templates",
      description:
        "Indoor service, factory patrol, search-and-rescue — a new client scenario is a new schema template, not a new mapping system to build from scratch.",
      icon: "/agentic/oems/domains.png",
    },
    {
      title: "Edge-to-cloud, deployable out of the box",
      description:
        "Runs as a split edge/cloud stack: an always-on safety loop on Jetson-class hardware, event-triggered reasoning on an autoscaling GPU cluster.",
      icon: "/agentic/oems/edge-cloud.png",
    },
    {
      title: "Security and reliability planes around every action",
      description:
        "Action allow-lists, a safety governor, sandboxed execution, and an immutable audit log bound what a robot can physically do in the field.",
      icon: "/agentic/oems/security.png",
    },
  ],
};

export const AGENTIC_CTA = {
  background: "/Vid.png",
  subtitle: "Give your robots real-world judgment with",
  wordmark: "sr agentic",
  cta: "Build with SR Agentic",
  rotatingBadge: "STRIKE ROBOT • STRIKE ROBOT • STRIKE ROBOT • STRIKE ROBOT • ",
  sidebarLinks: [
    { label: "About", href: "#" },
    { label: "Search & Insights", href: "#" },
    { label: "Strike Robot Labs", href: "#" },
    { label: "About", href: "#" },
    { label: "Term of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Security", href: "#" },
  ],
};
