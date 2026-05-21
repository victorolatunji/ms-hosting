// Labeled text input used in the contact form section.
// Just a label above an input, both styled to match the brand.

type FieldProps = {
  label: string;
  placeholder: string;
  type?: string; // "text" by default, but contact form has "email" too
  name?: string; // useful later when we wire up React Hook Form
};

export default function Field({ label, placeholder, type = "text", name }: FieldProps) {
  return (
    <div>
      {/* The tiny uppercase label above the input */}
      <label
        className="
          block font-mono text-[10px] tracking-[0.2em] uppercase
          mb-2 text-ink-soft
        "
      >
        {label}
      </label>

      {/* The input itself. Border uses our soft brand line.
          On focus, globals.css swaps the border color to clay automatically. */}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="
          w-full px-[15px] py-[13px]
          border border-line rounded-xl
          bg-transparent text-sm text-ink font-body
          transition-colors
        "
      />
    </div>
  );
}