export function SectionHeading({ id, label }: { id: string; label: string }) {
  return (
    <h2
      id={id}
      className="font-mono mb-8 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.09em] text-accent"
    >
      <span aria-hidden className="inline-block h-px w-7 bg-accent" />
      {label}
    </h2>
  );
}
