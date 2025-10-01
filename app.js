
(() => {
  const { useEffect, useMemo, useState } = React;
  const { createRoot } = ReactDOM;
  const { motion } = window.framerMotion;

  const projects = [
    {
      id: 1,
      slug: "cnc-toolpath-optimization",
      title: "CNC Toolpath Optimization",
      summary: "Reduced cycle time by 27% via adaptive clearing + tool engagement modeling.",
      image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=1600&auto=format&fit=crop",
      tags: ["Manufacturing", "Optimization", "CNC"],
      content: [
        { heading: "Overview", body: "Iterated toolpaths using engagement limits and rest machining to reduce air-cutting. Benchmarked against legacy CAM strategies." },
        { heading: "Process", body: "Modeled chip load and radial engagement. Adopted adaptive clearing for roughing, trochoidal paths in tight pockets, then optimized step-over and step-down." },
        { heading: "Results", body: "Cycle time -27%, tool wear -15%, surface finish Ra from 3.2 to 1.8 μm on key faces." },
      ],
    },
    {
      id: 2,
      slug: "robotic-gripper-rd",
      title: "Robotic Gripper R&D",
      summary: "Compliant underactuated gripper for variable geometry parts, 3D-printed TPU fingers.",
      image: "https://images.unsplash.com/photo-1581093588401-16e1c3115dfb?q=80&w=1600&auto=format&fit=crop",
      tags: ["Robotics", "Mechanisms", "Prototyping"],
      content: [
        { heading: "Concept", body: "Underactuated tendon routing with passive compliance enables shape adaptation and gentle grasping." },
        { heading: "Testing", body: "Validated on 20 SKUs with 94% grasp success at 0.8 N·m actuation limit." },
      ],
    },
    {
      id: 3,
      slug: "gearbox-nvh-study",
      title: "Gearbox NVH Study",
      summary: "Helical gear micro-geometry and bearing preload sensitivity analysis.",
      image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
      tags: ["Analysis", "NVH", "Gears"],
      content: [
        { heading: "Approach", body: "Performed loaded transmission error simulations and ran DOE on lead crowning and tip relief." },
      ],
    },
    {
      id: 4,
      slug: "aeroshell-topology-optimization",
      title: "Aeroshell Topology Opt.",
      summary: "Mass -18% using SIMP + lattice infill; FEA verified under gust load case.",
      image: "https://images.unsplash.com/photo-1581090700040-2c89b27c67d7?q=80&w=1600&auto=format&fit=crop",
      tags: ["FEA", "Optimization", "Aero"],
      content: [
        { heading: "Method", body: "Topology optimization with manufacturing constraints and lattice infills for buckling control." },
      ],
    },
    {
      id: 5,
      slug: "heat-exchanger-redesign",
      title: "Heat Exchanger Redesign",
      summary: "Compact plate HX; +12% effectiveness at same ΔP via chevron angle tuning.",
      image: "https://images.unsplash.com/photo-1581091870622-1e7e2a3d1f4d?q=80&w=1600&auto=format&fit=crop",
      tags: ["Thermal", "CFD", "Manufacturing"],
      content: [
        { heading: "CFD", body: "Ran RANS k-ω models to evaluate pressure drop vs. heat transfer at varying chevron angles." },
      ],
    },
    {
      id: 6,
      slug: "autonomous-rover-chassis",
      title: "Autonomous Rover Chassis",
      summary: "Monocoque CFRP chassis; stiffness-to-weight +35% vs. aluminum spaceframe.",
      image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1600&auto=format&fit=crop",
      tags: ["Composites", "Structures", "Rovers"],
      content: [
        { heading: "Layup", body: "Quasi-isotropic layup with localized UD reinforcements around drivetrain hardpoints." },
      ],
    },
  ];

  const GearIcon = (props={}) => React.createElement(
    "img",
    { src: "./assets/logo.svg", alt: "Logo", width: 20, height: 20, ...props }
  );

  const Tag = ({ label }) =>
    React.createElement("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-muted-foreground/20" }, label);

  const ProjectCard = ({ p }) => React.createElement(
    motion.a,
    { href: `#/project/${p.slug}`, className: "group block rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow bg-white/70 dark:bg-zinc-900/60 backdrop-blur", whileHover: { y: -4 } },
    React.createElement("div", { className: "aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-800" },
      React.createElement("img", { src: p.image, alt: p.title, className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]", loading: "lazy" })
    ),
    React.createElement("div", { className: "p-4" },
      React.createElement("div", { className: "flex items-start justify-between gap-3" },
        React.createElement("h3", { className: "font-semibold text-lg leading-tight" }, p.title),
        React.createElement("span", { className: "text-sm opacity-60 group-hover:opacity-100" }, "↗")
      ),
      React.createElement("p", { className: "mt-1 text-sm opacity-80" }, p.summary),
      React.createElement("div", { className: "mt-3 flex flex-wrap gap-1.5" },
        p.tags.map(t => React.createElement(Tag, { key: t, label: t }))
      )
    )
  );

  function useHashRoute() {
    const [hash, setHash] = React.useState(typeof window !== "undefined" ? window.location.hash : "#/");
    React.useEffect(() => {
      const onHash = () => setHash(window.location.hash || "#/");
      window.addEventListener("hashchange", onHash);
      if (!window.location.hash) window.location.hash = "#/";
      return () => window.removeEventListener("hashchange", onHash);
    }, []);
    return hash;
  }

  function parseRoute(hash) {
    const clean = hash.replace(/^#/, "");
    const parts = clean.split("/").filter(Boolean);
    if (parts.length === 0) return { name: "home" };
    if (parts[0] === "project" && parts[1]) return { name: "project", slug: parts[1] };
    return { name: "home" };
  }

  const ProjectDetail = ({ slug }) => {
    const proj = React.useMemo(() => projects.find(p => p.slug === slug), [slug]);
    if (!proj) {
      return React.createElement("div", { className: "py-12" },
        React.createElement("a", { href: "#/", className: "inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100" }, "← Back to projects"),
        React.createElement("p", { className: "mt-6" }, "Project not found.")
      );
    }

    return React.createElement("article", { className: "pt-2 pb-8" },
      React.createElement("a", { href: "#/", className: "inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100" }, "← Back to projects"),
      React.createElement("h1", { className: "mt-4 text-2xl font-semibold tracking-tight" }, proj.title),
      React.createElement("p", { className: "mt-1 text-sm opacity-80" }, proj.summary),
      React.createElement("div", { className: "mt-3 flex flex-wrap gap-1.5" },
        proj.tags.map(t => React.createElement(Tag, { key: t, label: t }))
      ),
      React.createElement("div", { className: "prose prose-zinc dark:prose-invert max-w-none mt-8" },
        (proj.content || []).map((sec, i) =>
          React.createElement("section", { key: i, className: "mb-6" },
            React.createElement("h2", { className: "text-lg font-semibold mb-2" }, sec.heading),
            React.createElement("p", { className: "opacity-90 leading-relaxed" }, sec.body)
          )
        )
      )
    );
  };

  const App = () => {
    const hash = useHashRoute();
    const route = parseRoute(hash);

    return React.createElement("div", { className: "min-h-screen" },
      React.createElement("header", { className: "w-full sticky top-0 z-10 bg-white/70 dark:bg-zinc-950/70 backdrop-blur border-b border-zinc-200 dark:border-zinc-800" },
        React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16" },
          React.createElement("a", { href: "#/", className: "flex items-center gap-3" },
            React.createElement("div", { className: "h-10 w-10 rounded-xl grid place-items-center border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden" },
              React.createElement(GearIcon, null)
            ),
            React.createElement("div", null,
              React.createElement("h1", { className: "text-xl font-semibold tracking-tight" }, "Your Name"),
              React.createElement("p", { className: "text-sm opacity-70" }, "Mechanical Engineer")
            )
          ),
          React.createElement("nav", { className: "flex items-center gap-6 text-sm" },
            React.createElement("a", { className: "hover:underline underline-offset-4", href: "#/" }, "Home"),
            React.createElement("a", { className: "hover:underline underline-offset-4", href: "#about" }, "About"),
            React.createElement("a", { className: "hover:underline underline-offset-4", href: "#contact" }, "Contact"),
            React.createElement("a", { href: "#resume", className: "px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm hover:shadow-sm" }, "Resume"),
            React.createElement("a", { href: "#contact", className: "px-3 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm hover:shadow" }, "Get in touch")
          )
        )
      ),
      React.createElement("main", { className: (route.name === "project" ? "pt-4 pb-10" : "py-12") + " max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
        route.name === "home" ? React.createElement(React.Fragment, null,
          React.createElement("section", { id: "projects", className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" },
            projects.map(p => React.createElement(ProjectCard, { key: p.id, p }))
          ),
          React.createElement("section", { id: "about", className: "mt-16 max-w-3xl" },
            React.createElement("h2", { className: "text-lg font-semibold mb-2" }, "About"),
            React.createElement("p", { className: "text-sm opacity-80 leading-relaxed" }, "Short bio here. Mention core tools (SolidWorks / Fusion / NX, Ansys / Abaqus / Nastran, MATLAB / Python), fabrication experience (CNC, turning, 3D printing, composites), and interests. Keep it concise and outcomes-focused.")
          ),
          React.createElement("section", { id: "contact", className: "mt-12" },
            React.createElement("h2", { className: "text-lg font-semibold mb-2" }, "Contact"),
            React.createElement("ul", { className: "text-sm opacity-80" },
              React.createElement("li", null, "Email: you@example.com"),
              React.createElement("li", null, "LinkedIn: linkedin.com/in/yourname"),
              React.createElement("li", null, "Location: City, State")
            )
          )
        ) : React.createElement(ProjectDetail, { slug: route.slug })
      )
    );
  };

  const root = createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
})();
