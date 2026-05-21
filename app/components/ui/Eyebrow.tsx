// Small uppercase label with a terracotta diamond, used above every section heading.
// The "color" prop lets dark sections (like the About section) override the default clay
// with amber so it stays visible on a dark moss background.

type EyebrowProps = {
  children: React.ReactNode;
  color?: "clay" | "amber"; // restrict to the two colors actually used in the design
};

export default function Eyebrow({ children, color = "clay" }: EyebrowProps) {
  // Tailwind doesn't let you build class names dynamically from props at build time
  // (e.g. `bg-${color}` would not work, the class wouldn't be detected).
  // So we map the prop to full class strings here.
  const textColor = color === "amber" ? "text-amber" : "text-clay";
  const bgColor   = color === "amber" ? "bg-amber"   : "bg-clay";

  return (
    <div
      className={`
        font-mono ${textColor}
        text-[11px] tracking-[0.28em] uppercase
        mb-[18px] inline-flex items-center gap-3
      `}
    >
      {/* The diamond, a 7px square rotated 45 degrees */}
      <span
        className={`${bgColor} w-[7px] h-[7px] rotate-45 inline-block shrink-0`}
      />
      <span className="shrink-0">{children}</span>
    </div>
  );
}