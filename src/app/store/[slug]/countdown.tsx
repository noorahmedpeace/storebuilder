"use client";

import { useEffect, useState } from "react";

const UNITS = [
  { key: "d", label: "Days", ms: 86400000 },
  { key: "h", label: "Hours", ms: 3600000 },
  { key: "m", label: "Min", ms: 60000 },
  { key: "s", label: "Sec", ms: 1000 },
];

export function Countdown({
  endsAt,
  title,
  brand,
  accent,
}: {
  endsAt: string;
  title?: string;
  brand: string;
  accent: string;
}) {
  const target = new Date(endsAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (Number.isNaN(target)) return null;

  const remaining = now === null ? null : Math.max(0, target - now);

  function value(ms: number, divisor: number, mod: number) {
    if (remaining === null) return "--";
    return String(Math.floor((remaining / divisor) % mod)).padStart(2, "0");
  }

  const cells = [
    value(remaining ?? 0, UNITS[0].ms, Infinity),
    value(remaining ?? 0, UNITS[1].ms, 24),
    value(remaining ?? 0, UNITS[2].ms, 60),
    value(remaining ?? 0, UNITS[3].ms, 60),
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 text-center lg:px-8">
      {title ? <h2 className="mb-6 text-3xl font-bold">{title}</h2> : null}
      <div className="flex justify-center gap-3">
        {UNITS.map((u, i) => (
          <div
            key={u.key}
            className="min-w-[72px] rounded-xl px-4 py-3 text-white"
            style={{ background: i === 0 ? brand : accent }}
          >
            <p className="text-3xl font-bold tabular-nums">{cells[i]}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              {u.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
