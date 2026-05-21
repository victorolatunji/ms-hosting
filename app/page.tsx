import Header from "./components/Header";
// import Hero from "./components/Hero";

export default function Home() {
  return (
    <>
      <Header />
      {/* <Hero /> */}
      {/* Spacer to test scroll. Will be removed as we add more sections. */}
      <div className="min-h-[100vh]" />
    </>
  );
}


// // Temporary test page to confirm brand colors and fonts load correctly.
// // We'll replace this with the real homepage in the next steps.
// export default function Home() {
//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center p-8">
//       {/* font-display = Cormorant Garamond, text-moss = brand dark green */}
//       <h1 className="font-display text-6xl text-moss mb-4">
//         M&amp;S Hosting
//       </h1>

//       {/* font-body = DM Sans (the default body font we set in globals.css),
//           text-ink-soft = the muted text grey */}
//       <p className="font-body text-ink-soft text-lg mb-8">
//         Brand setup test
//       </p>

//       {/* A row of color swatches to visually confirm each brand color works */}
//       <div className="flex gap-3 flex-wrap justify-center">
//         <Swatch color="bg-bone"      label="bone" />
//         <Swatch color="bg-bone-soft" label="bone-soft" />
//         <Swatch color="bg-moss"      label="moss"      dark />
//         <Swatch color="bg-moss-dark" label="moss-dark" dark />
//         <Swatch color="bg-clay"      label="clay"      dark />
//         <Swatch color="bg-clay-soft" label="clay-soft" dark />
//         <Swatch color="bg-amber"     label="amber" />
//         <Swatch color="bg-ink"       label="ink"       dark />
//         <Swatch color="bg-ink-soft"  label="ink-soft"  dark />
//       </div>

//       {/* font-mono = DM Mono, used for small uppercase labels in the design */}
//       <p className="font-mono text-xs tracking-widest uppercase text-clay mt-8">
//         If you can read this in mono, fonts are working
//       </p>
//     </main>
//   );
// }

// // Small helper component. Just a colored square with a label below.
// // "dark" prop flips the label to white text for dark swatches.
// function Swatch({
//   color,
//   label,
//   dark = false,
// }: {
//   color: string;
//   label: string;
//   dark?: boolean;
// }) {
//   return (
//     <div className="flex flex-col items-center">
//       {/* w-20 h-20 = 80px square. border-line = our faint brand border. */}
//       <div className={`${color} w-20 h-20 rounded-lg border border-line`} />
//       <span
//         className={`font-mono text-xs mt-2 ${
//           dark ? "text-ink" : "text-ink-soft"
//         }`}
//       >
//         {label}
//       </span>
//     </div>
//   );
// }