// One cell of the hero search bar. Shows a small uppercase label
// with an icon, and a value underneath (e.g. "Where" / "Greater Toronto").
// In Phase 3 we'll wire these up to real date pickers and guest counters.
// For now they're display only.

type SearchFieldProps = {
  icon: React.ReactNode; // a Lucide icon, passed in from the parent
  label: string;
  value: string;
};

export default function SearchField({ icon, label, value }: SearchFieldProps) {
  return (
    <div className="px-[14px] py-3 rounded-xl cursor-pointer min-w-0">
      {/* Label row, mono font with the icon to its left */}
      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-soft mb-1 flex items-center gap-1.5">
        {icon} {label}
      </div>

      {/* The value, larger and darker.
          truncate keeps long values from breaking the layout on narrow screens. */}
      <div className="text-sm font-medium text-ink truncate">
        {value}
      </div>
    </div>
  );
}