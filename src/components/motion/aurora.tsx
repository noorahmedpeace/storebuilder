/** Animated aurora/gradient backdrop (CSS-only, GPU transform). Pass brand
 *  colors; place inside a `relative overflow-hidden` section. */
export function Aurora({
  from = "#50b79a",
  via = "#143c3a",
  to = "#f3b74f",
  className = "",
}: {
  from?: string;
  via?: string;
  to?: string;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="aurora-layer"
        style={{ background: `radial-gradient(circle at 30% 30%, ${from}, transparent 60%)` }}
      />
      <div
        className="aurora-layer"
        style={{
          animationDelay: "-7s",
          background: `radial-gradient(circle at 70% 65%, ${to}, transparent 60%)`,
        }}
      />
      <div
        className="aurora-layer"
        style={{
          animationDelay: "-14s",
          background: `radial-gradient(circle at 50% 80%, ${via}, transparent 55%)`,
        }}
      />
    </div>
  );
}
