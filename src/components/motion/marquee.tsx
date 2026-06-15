/** Infinite horizontal marquee (CSS-only; pauses on hover). */
export function Marquee({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="motion-marquee gap-10 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-sm font-semibold text-[#4f5b58]"
          >
            <span className="size-1.5 rounded-full bg-[#143c3a]/40" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
