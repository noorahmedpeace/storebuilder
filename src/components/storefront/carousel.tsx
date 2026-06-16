"use client";

import { useEffect, useState } from "react";

/** Auto-rotating hero image slider. */
export function Carousel({
  images,
  caption,
}: {
  images: string[];
  caption?: string;
}) {
  const imgs = images.filter(Boolean);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return;
    const id = setInterval(() => setI((p) => (p + 1) % imgs.length), 4500);
    return () => clearInterval(id);
  }, [imgs.length]);

  if (!imgs.length) return null;

  return (
    <section className="relative">
      <div className="relative aspect-[2/1] w-full overflow-hidden md:aspect-[3/1]">
        {imgs.map((src, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: idx === i ? 1 : 0,
              background: `center/cover no-repeat url(${src})`,
            }}
          />
        ))}
        {caption ? (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6 text-2xl font-bold text-white">
            {caption}
          </div>
        ) : null}
      </div>
      {imgs.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {imgs.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className="size-2 rounded-full transition"
              style={{ background: idx === i ? "#fff" : "rgba(255,255,255,0.5)" }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
